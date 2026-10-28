import PinnedWebSocketModule from "./PinnedWebSocketModule";
import {
    PinnedWebSocketCloseEvent,
    PinnedWebSocketErrorEvent,
    PinnedWebSocketMessageEvent,
} from "./PinnedWebSocket.types";

export default class PinnedWebSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;

    // One registry and one set of native listeners shared by all instances
    private static instances = new Map<number, PinnedWebSocket>();
    private static nextId = 1;
    private static listenersAttached = false;

    private static attachListeners(): void {
        if (PinnedWebSocket.listenersAttached) return;
        PinnedWebSocket.listenersAttached = true;

        PinnedWebSocketModule.addListener("onOpen", (e) => {
            PinnedWebSocket.instances.get(e.id)?.handleOpen();
        });
        PinnedWebSocketModule.addListener("onMessage", (e) => {
            PinnedWebSocket.instances.get(e.id)?.handleMessage(e.data);
        });
        PinnedWebSocketModule.addListener("onError", (e) => {
            PinnedWebSocket.instances.get(e.id)?.handleError(e.message);
        });
        PinnedWebSocketModule.addListener("onClose", (e) => {
            PinnedWebSocket.instances.get(e.id)?.handleClose(e.code, e.reason);
        });
    }

    readonly url: string;
    readyState: number = PinnedWebSocket.CONNECTING;

    onopen: (() => void) | null = null;
    onmessage: ((event: PinnedWebSocketMessageEvent) => void) | null = null;
    onerror: ((event: PinnedWebSocketErrorEvent) => void) | null = null;
    onclose: ((event: PinnedWebSocketCloseEvent) => void) | null = null;

    private readonly id: number;

    constructor(url: string) {
        this.url = url;
        this.id = PinnedWebSocket.nextId++;

        PinnedWebSocket.attachListeners();
        PinnedWebSocket.instances.set(this.id, this);

        try {
            PinnedWebSocketModule.open(this.id, url);
        } catch (err: any) {
            // Deferred so the caller can assign handlers first, like native WebSocket.
            const message = err?.message ?? String(err);
            setTimeout(() => {
                this.handleError(message);
                this.handleClose(1006, message);
            }, 0);
        }
    }

    send(data: string): void {
        if (this.readyState === PinnedWebSocket.CONNECTING) {
            throw new Error("PinnedWebSocket is still connecting");
        }
        if (this.readyState !== PinnedWebSocket.OPEN) return;
        PinnedWebSocketModule.send(this.id, data);
    }

    close(code: number = 1000, reason: string = ""): void {
        if (
            this.readyState === PinnedWebSocket.CLOSING ||
            this.readyState === PinnedWebSocket.CLOSED
        ) {
            return;
        }

        const wasConnecting = this.readyState === PinnedWebSocket.CONNECTING;
        this.readyState = PinnedWebSocket.CLOSING;

        if (wasConnecting) {
            PinnedWebSocketModule.cancel(this.id);
        } else {
            PinnedWebSocketModule.close(this.id, code, reason);
        }
    }

    private handleOpen(): void {
        this.readyState = PinnedWebSocket.OPEN;
        this.onopen?.();
    }

    private handleMessage(data: string): void {
        this.onmessage?.({ data });
    }

    private handleError(message: string): void {
        this.onerror?.({ message });
    }

    private handleClose(code: number, reason: string): void {
        if (this.readyState === PinnedWebSocket.CLOSED) return;
        this.readyState = PinnedWebSocket.CLOSED;
        PinnedWebSocket.instances.delete(this.id);
        this.onclose?.({ code, reason });
    }
}