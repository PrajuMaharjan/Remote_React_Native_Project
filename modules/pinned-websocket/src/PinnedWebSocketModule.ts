import { NativeModule, requireNativeModule } from "expo";

import { PinnedWebSocketModuleEvents } from "./PinnedWebSocket.types";

declare class PinnedWebSocketModule extends NativeModule<PinnedWebSocketModuleEvents> {
    open(id: number, url: string): void;
    send(id: number, data: string): boolean;
    close(id: number, code: number, reason: string): boolean;
    cancel(id: number): void;
    probeTls(host:string,port:number,timeoutMs:number): Promise<boolean>;
}

export default requireNativeModule<PinnedWebSocketModule>("PinnedWebSocket");