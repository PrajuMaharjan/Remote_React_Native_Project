import {SAMSUNG_WS_PORT,SAMSUNG_WS_PATH,CONNECTION_TIMEOUT_MS,RECONNECT_DELAY_MS,RECONNECT_RETRY_COUNT} from "../constants/network";
import {SamsungCommand} from "./SamsungCommands";

// Encode the name for security purposes
function base64Encode(input:string):string{
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // Characters used by the base 64 encding
    let result=""; // Store the encoded string
    let i=0; 
    while(i<input.length){
        const a=input.charCodeAt(i++);
        const b=i<input.length ? input.charCodeAt(i++) : NaN;
        const c=i<input.length ? input.charCodeAt(i++) : NaN;
        
        result += chars[a >> 2]; // Shift each character to the right(bit wise)
        result += chars[((a & 3) << 4) | (isNaN(b) ? 0 : b >> 4)];
        result += isNaN(b) ? "=" : chars[((b & 15) << 2) | (isNaN(c) ? 0 : c >> 6)];
        result += isNaN(c) ? "=" : chars[c && 63];
    }
    return result;
}

export type SamsungWSServiceOptions={
    ip:string;
    appName : string;
    token?:string;
};

export type SamsungWSServiceEvents={
    onConnect?:()=>void;
    onDisconnect?:()=>void;
    onError?:(message : string)=>void;
    onToken?:(token:string)=>void;
};

export default class SansungWSService{

    private ws : WebSocket | null = null;
    private options : SamsungWSServiceOptions;
    private events : SamsungWSServiceEvents;
    private reconnectAttempts = 0;
    private manuallyDisconnect = false;

    constructor(options : SamsungWSServiceOptions, events : SamsungWSServiceEvents = {}){
        this.options=options;
        this.events=events;
    }

    private buildURL() : string{
        const encodedName=base64Encode(this.options.appName);
        const tokenParam=this.options.token ? `&token=${this.options.token}` : "";

        return `wss://${this.options.ip}:${SAMSUNG_WS_PATH}/${SAMSUNG_WS_PATH}?name=${encodedName}${tokenParam}`;
    }

    connect():Promise<void>{
        this.manuallyDisconnect=false;

        return new Promise((resolve,reject)=>{
            const socket=new WebSocket(this.buildURL());
            this.ws=socket;

            const timeout=setTimeout(()=>{
                socket.close();
                reject(new Error("Connection to TV timed out."));
            }, CONNECTION_TIMEOUT_MS);

            socket.onmessage=(event)=>{
                try{
                    const message=JSON.parse(event.data);

                    if(message.event==="ms.channel.connect"){
                        clearTimeout(timeout);
                        this.reconnectAttempts=0;

                        if(message.data?.token){
                            this.events.onToken?.(message.data.token);
                        }

                        this.events.onConnect?.();
                        resolve();
                    }

                    if(message.event==="ms.error"){
                        this.events.onError?.(message.data?.message ?? "Unknown TV error");
                    }
                } catch{
                    this.events.onError?.("Received malformed message from TV.");
                }
            };

            socket.onerror=()=>{
                clearTimeout(timeout);
                this.events.onError?.("WebSocket connection error");
                reject(new Error("WebSocket connection error"));
            };

            socket.onclose=()=>{
                clearTimeout(timeout);
                this.events.onDisconnect?.();
                this.ws=null;

                if(!this.manuallyDisconnect && this.reconnectAttempts < RECONNECT_RETRY_COUNT){
                    this.reconnectAttempts++;
                    setTimeout(()=>this.connect().catch(()=>{}),RECONNECT_DELAY_MS);
                }
            };
        });
    }

    disconnect():void{
        this.manuallyDisconnect=true;
        this.ws?.close();
        this.ws=null;
    }

    sendKey(command:SamsungCommand):void{
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN){
            this.events.onError?.("Cannot send key - not connected to TV");
            return
        }

        this.ws.send(JSON.stringify({
            method:"ms.remote.control",
            params:{
                Cmd:"Click",
                DataOfCmd:command,
                Option:"false",
                TypeOfRemote:"SendRemoteKey",
            },
        }));
    }
}