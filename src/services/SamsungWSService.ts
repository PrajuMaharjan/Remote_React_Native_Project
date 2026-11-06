import {SAMSUNG_WS_PORT,SAMSUNG_WS_PATH,CONNECTION_TIMEOUT_MS,RECONNECT_DELAY_MS,RECONNECT_RETRY_COUNT} from "../constants/network";
import {SamsungCommand} from "./SamsungCommands";
import PinnedWebSocket from "../../modules/pinned-websocket";
import {Buffer} from "buffer";
import {base64Encode} from "../utils/base64";

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

    private ws : PinnedWebSocket | null = null;
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

        return `wss://${this.options.ip}:${SAMSUNG_WS_PORT}/${SAMSUNG_WS_PATH}?name=${encodedName}${tokenParam}`;
    }

    connect():Promise<void>{
        console.log("TV connect() attempt at ",new Date().toISOString());
        this.manuallyDisconnect=false;

        return new Promise((resolve,reject)=>{
            const socket=new PinnedWebSocket(this.buildURL());
            this.ws=socket;
            socket.onopen=()=>console.log("TV socket open");

            let established=false;
            let timeOut=false;
            let failed=false;

            const timeout=setTimeout(()=>{
                timeOut=true;
                socket.close();
                reject(new Error("Connection to TV timed out."));
            }, CONNECTION_TIMEOUT_MS);

            socket.onmessage=(event)=>{
                console.log("TV message: ",String(event.data).replace(/"token":"[^"]*/g,'"token":"<redacted>"'));
                try{
                    const message=JSON.parse(event.data);

                    if(message.event==="ms.channel.connect"){
                        clearTimeout(timeout);
                        established=true;
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

            socket.onerror=(event)=>{
                console.log("TV Websocket error: ",event.message);
                clearTimeout(timeout);
                if(timeOut) return;
                if(!established) failed=true;
                this.events.onError?.("WebSocket connection error");
                reject(new Error("WebSocket connection error"));
            };

            socket.onclose=(event)=>{
                console.log("TV Websocket closed - code:",event.code,"reason: ",event.reason);
                clearTimeout(timeout);
                this.events.onDisconnect?.();
                if(this.ws===socket) this.ws=null;

                if(failed && !this.manuallyDisconnect && this.reconnectAttempts < RECONNECT_RETRY_COUNT){
                    this.reconnectAttempts++;
                    setTimeout(()=>{
                        if(this.manuallyDisconnect) return;
                        this.connect().catch(()=>{});
                    },RECONNECT_DELAY_MS);
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
        if(!this.ws || this.ws.readyState !== PinnedWebSocket.OPEN){
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

    sendText(text:string) : void{
        if(!this.ws || this.ws.readyState !== PinnedWebSocket.OPEN){
            this.events.onError?.("Cannot send text - not connected to TV");
            return;
        }

        this.ws.send(JSON.stringify({
            method:"ms.remote.control",
            params:{
                Cmd:Buffer.from(text,"utf8").toString("base64"),
                DataOfCmd:"base64",
                TypeOfRemote:"SendInputKey",
            },
        }));
    }
}