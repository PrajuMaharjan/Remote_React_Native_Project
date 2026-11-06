import React,{createContext,useCallback,useMemo,useRef,useState} from "react"
import SamsungWSService from "../services/SamsungWSService";
import {APP_NAME} from "../config/appConfig";
import {SamsungCommand} from "../services/SamsungCommands";
import {getTVToken,saveTVToken} from "../services/StorageService";
import {Device} from "../components/general/DeviceBar";

type SamsungTVContextValue={
    isConnected:boolean;
    lastError:string | null;
    connect:(device:Device)=>Promise<void>;
    disconnect:()=>void;
    sendKey:(command:SamsungCommand)=>void;
    sendText:(text:string)=>ViewTransitionUpdateCallback;
};

export const SamsungTVContext=createContext<SamsungTVContextValue | null>(null);

export function SamsungTVProvider({children} : {children:React.ReactNode}){
    const serviceRef=useRef<SamsungWSService | null>(null);
    
    const [isConnected,setIsConnected]=useState(false);
    const [lastError,setLastError]=useState<string | null>(null);

    const connect=useCallback(async(device:Device)=>{
        if(!device.ipAddress){
            const message = "This ldevice has no IP Address."
            setLastError(message);
            throw new Error(message);
        }
        setLastError(null);
        
        // Only one device can/should be connected at one time
        serviceRef.current?.disconnect();
        setIsConnected(false);

        const existingToken=await getTVToken(device.id);

        const service:SamsungWSService = new SamsungWSService(
            {ip:device.ipAddress,appName:APP_NAME,token:existingToken ?? undefined},
            
            {

                onConnect:()=>{
                    if(serviceRef.current !== service) return;
                    setIsConnected(true);
                },
                
                onDisconnect:()=>{
                    if(serviceRef.current !== service) return;
                    setIsConnected(false);
                },
                
                onError:(message)=>{
                    if(serviceRef.current !== service) return;
                    setLastError(message);
                },

                onToken:(token)=>{
                    saveTVToken(device.id,token).catch(()=>{});
                },
            }
        );

        serviceRef.current=service;

        try{
            await service.connect();
        }catch(err){
            const message=err instanceof Error ? err.message : "Failed to connect to TV"
            if(serviceRef.current===service) setLastError(message);
            throw err instanceof Error ? err : new Error(message);
        }
    },[]);

    const disconnect=useCallback(()=>{
        serviceRef.current?.disconnect();
        serviceRef.current=null;
        setIsConnected(false);
    },[]);

    const sendKey=useCallback((command:SamsungCommand)=>{
        serviceRef.current?.sendKey(command);
    },[]);

    const sendText=useCallback((text:string)=>{
        serviceRef.current?.sendText(text);
    },[]);

    const value=useMemo(
        ()=>({isConnected,lastError,connect,disconnect,sendKey,sendText}),
        [isConnected,lastError,connect,disconnect,sendKey,sendText]
    );

    return <SamsungTVContext.Provider value={value}>{children}</SamsungTVContext.Provider>
}