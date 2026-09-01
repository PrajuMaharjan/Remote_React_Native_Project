// Constants for Samsung WebSocket connection

export const SAMSUNG_WS_PORT=8002;
export const SAMSUNG_WS_PATH="api/v2/channels/samsung.remote.control";

export const CONNECTION_TIMEOUT_MS=5000;
export const RECONNECT_RETRY_COUNT=3;
export const RECONNECT_DELAY_MS=2000;
export const HEARTBEAT_INTERVAL_MS=15000; // To ckeep the connection alive