package expo.modules.pinnedwebsocket

import java.io.ByteArrayInputStream
import java.security.KeyStore
import java.security.MessageDigest
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.X509TrustManager
import javax.security.auth.x500.X500Principal

// Trusts ONLY certificates chained to Samsung's "SmartViewSDK Root CA G2".
// Normal chain validation (signature, dates) still runs; nothing is bypassed.
internal object SamsungTrust {

    // SHA-256 of the root's DER encoding (matches `openssl x509 -fingerprint -sha256`).
    private const val ROOT_SHA256_HEX =
        "bb9b494c2c69925f29254ea6e0de3d6435d6b4102e483c016f31c645c2afdb94"

    private const val EXPECTED_LEAF_CN = "Samsung SmartViewSDK Cert. G2"

    private const val ROOT_PEM = """-----BEGIN CERTIFICATE-----
MIIDsDCCApigAwIBAgIUMJRaXn1A8EKOpYBPUKKcBZs84dAwDQYJKoZIhvcNAQEN
BQAwbzELMAkGA1UEBhMCS1IxHDAaBgNVBAoME1NhbXN1bmcgRWxlY3Ryb25pY3Mx
IDAeBgNVBAsMF1Zpc3VhbCBEaXNwbGF5IEJ1c2luZXNzMSAwHgYDVQQDDBdTbWFy
dFZpZXdTREsgUm9vdCBDQSBHMjAgFw0yMjA0MDcwMTMwMTlaGA8yMDcyMDMyNTAx
MzAxOVowbzELMAkGA1UEBhMCS1IxHDAaBgNVBAoME1NhbXN1bmcgRWxlY3Ryb25p
Y3MxIDAeBgNVBAsMF1Zpc3VhbCBEaXNwbGF5IEJ1c2luZXNzMSAwHgYDVQQDDBdT
bWFydFZpZXdTREsgUm9vdCBDQSBHMjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBAK6fAHwocr4JdCupjzkfR35Yc7vjXkNWlgULN2wlEq+rK3DDdEkj3GWZ
X6zk9sTLyLP3ESQqWiQgU8Ph+IRPbchEi7safr+X+VdvNWb6cyayedVA2aL8pnxS
OrlCrT7+0sWMkk9Mlc8aSVDW1hwQY7H205b77qG+N/u5F2YBevcYYi/V5RkGc67q
RQ3pX+TpiiCpmuSIlNYae0mQT/NM2+x2mVJtszOlIJn1qWlpdsd/DyEWpTHeknoz
OaFtc4vTeT0LD3FPK6TQDBU3xDmkItavtVEd1eQAwApQcjRDef8XyzvMFVLhYKyJ
0WLMhWXjB1az14w6fZ9kdb4kmPpf9skCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB
/zAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYEFMetCgEe7JwvWp/J1O6cRw4Bx9OA
MA0GCSqGSIb3DQEBDQUAA4IBAQCfR6LsaDacG4RczhNlL9L2dy+AKS1/MEtZQXuD
EooAQG69vIoO6j3hvFMJP+YsrrOhS3WrjOhKAX2T6DmI/WwNqZiJMoDbTDhPaF51
+npYX9Q4ZA7fhKADro988IF0e9kTKgOG7FeXg2VPyJFwxRgHTE5P0hUPfng9eyLl
hQX2aa14VsB+IvauGctHPqPiMsVTAhbnT6twe+q7GDjKpweceuw5s/zYby/gH0wH
WZTNCmk54BB+BEtYEzjW1jeyLoAHh4D00h0gauNTHUrN/Dy3QMYOAcfxLLVvZTNi
/9+yY10pPCpi5L/W13klJP28BQZBG1vQvr0k0NkKsZSpQClI
-----END CERTIFICATE-----"""

    private fun loadRoot(): X509Certificate {
        val cert = CertificateFactory.getInstance("X.509")
            .generateCertificate(ByteArrayInputStream(ROOT_PEM.toByteArray(Charsets.US_ASCII)))
                as X509Certificate

        val fingerprint = MessageDigest.getInstance("SHA-256")
            .digest(cert.encoded)
            .joinToString("") { "%02x".format(it) }

        // Refuses to run if the embedded text was mistyped or altered.
        check(fingerprint == ROOT_SHA256_HEX) {
            "Embedded Samsung root certificate fingerprint mismatch: $fingerprint"
        }
        return cert
    }

    val trustManager: X509TrustManager by lazy {
        val keyStore = KeyStore.getInstance(KeyStore.getDefaultType()).apply {
            load(null, null)
            setCertificateEntry("samsung-smartviewsdk-root-g2", loadRoot())
        }
        val factory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
        factory.init(keyStore)
        factory.trustManagers.filterIsInstance<X509TrustManager>().first()
    }

    val sslSocketFactory: SSLSocketFactory by lazy {
        SSLContext.getInstance("TLS").apply {
            init(null, arrayOf(trustManager), null)
        }.socketFactory
    }

    // The TV's cert CN is never its IP, so the default host check can't pass.
    // Instead require the leaf's CN to be exactly the expected Samsung value.
    val hostnameVerifier: HostnameVerifier = HostnameVerifier { _, session ->
        try {
            val leaf = session.peerCertificates.firstOrNull() as? X509Certificate
            if (leaf == null) {
                false
            } else {
                val dn = leaf.subjectX500Principal.getName(X500Principal.RFC2253)
                val cn = Regex("(?:^|,)CN=([^,]+)").find(dn)?.groupValues?.get(1)
                cn == EXPECTED_LEAF_CN
            }
        } catch (e: Exception) {
            false
        }
    }
}