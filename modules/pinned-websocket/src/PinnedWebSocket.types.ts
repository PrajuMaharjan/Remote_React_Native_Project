export type PinnedWebSocketModuleEvents = {
    onOpen: (event: { id: number }) => void;
    onMessage: (event: { id: number; data: string }) => void;
    onError: (event: { id: number; message: string }) => void;
    onClose: (event: { id: number; code: number; reason: string }) => void;
};

export interface PinnedWebSocketMessageEvent {
    data: string;
}

export interface PinnedWebSocketErrorEvent {
    message: string;
}

export interface PinnedWebSocketCloseEvent {
    code: number;
    reason: string;
}