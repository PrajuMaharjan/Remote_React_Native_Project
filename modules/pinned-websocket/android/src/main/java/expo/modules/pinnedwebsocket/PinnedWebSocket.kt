package expo.modules.pinnedwebsocket

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.ConcurrentHashMap
import java.net.InetSocketAddress
import java.net.Socket
import javax.net.ssl.SSLSocket

class PinnedWebSocketModule : Module() {

    // JS chooses the id, so JS can subscribe before open() and no event can be missed.
    private val sockets = ConcurrentHashMap<Int, WebSocket>()

    // Lazy: a bad embedded cert surfaces as a JS error at first open(), not at app start.
    private val client: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .sslSocketFactory(SamsungTrust.sslSocketFactory, SamsungTrust.trustManager)
            .hostnameVerifier(SamsungTrust.hostnameVerifier)
            .build()
    }

    private fun emitFailure(id: Int, message: String) {
        // Mirrors native WebSocket: an error event, then a close with code 1006.
        sendEvent("onError", mapOf("id" to id, "message" to message))
        sendEvent("onClose", mapOf("id" to id, "code" to 1006, "reason" to message))
    }
    
    // TLS handshake + identity check only. Sends no HTTP request, so the TV's pairing
    // prompt (triggered by the WebSocket upgrade) is never reached.
    private fun probeTls(host: String, port: Int, timeoutMs: Int): Boolean {
        val raw = Socket()
        try {
            raw.connect(InetSocketAddress(host, port), timeoutMs)
            raw.soTimeout = timeoutMs
            val ssl = SamsungTrust.sslSocketFactory.createSocket(raw, host, port, true) as SSLSocket
            try {
                ssl.startHandshake() // throws unless the chain validates against the pinned Samsung root
                return SamsungTrust.hostnameVerifier.verify(host, ssl.session) // exact CN check
            } finally {
                try { ssl.close() } catch (e: Exception) { }
            }
        } catch (e: Exception) {
            return false
        } finally {
            try { raw.close() } catch (e: Exception) { }
        }
    }

    private fun openSocket(id: Int, url: String) {
        val request = try {
            Request.Builder().url(url).build()
        } catch (e: IllegalArgumentException) {
            emitFailure(id, "Invalid URL: ${e.message}")
            return
        }

        val listener = object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                sendEvent("onOpen", mapOf("id" to id))
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                sendEvent("onMessage", mapOf("id" to id, "data" to text))
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                // 1000, not `code`: a remote close with no code reports 1005, which OkHttp refuses to send.
                webSocket.close(1000, null)
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                sockets.remove(id)
                sendEvent("onClose", mapOf("id" to id, "code" to code, "reason" to reason))
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                sockets.remove(id)
                emitFailure(id, t.message ?: t.javaClass.simpleName)
            }
        }

        sockets[id] = client.newWebSocket(request, listener)
    }

    override fun definition() = ModuleDefinition {
        Name("PinnedWebSocket")

        Events("onOpen", "onMessage", "onError", "onClose")

        Function("open") { id: Int, url: String ->
            openSocket(id, url)
        }

        Function("send") { id: Int, data: String ->
            sockets[id]?.send(data) ?: false
        }

        // Graceful close (valid only once connected).
        Function("close") { id: Int, code: Int, reason: String ->
            sockets[id]?.close(code, reason) ?: false
        }

        // Immediate abort, used when closing while still connecting. Surfaces as error + close 1006.
        Function("cancel") { id: Int ->
            sockets[id]?.cancel()
            Unit
        }
        
        // Runs off the JS thread; resolves true only for a verified Samsung TLS endpoint
        AsyncFunction("probeTls") { host: String, port: Int, timeoutMs: Int ->
            probeTls(host, port, timeoutMs)
        }

        OnDestroy {
            sockets.values.forEach { it.cancel() }
            sockets.clear()
        }
    }
}