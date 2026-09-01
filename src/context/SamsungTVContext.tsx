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
};

export const SamsungTVContext=createContext<SamsungTVContextValue | null>(null);

export function SamsungTVProvider({children} : {children:React.ReactNode}){
    const serviceRef=useRef<SamsungWSService | null>(null);
    const currentDeviceIdRef=useRef<string | null>(null);
    
    const [isConnected,setIsConnected]=useState(false);
    const [lastError,setLastError]=useState<string | null>(null);

    const connect=useCallback(async(device:Device)=>{
        if(!device.ipAddress){
            const message = "This ldevice has no IP Address."
            setLastError(message);
            throw new Error(message);
        }
        setLastError(null);
        currentDeviceIdRef.current=device.id;
        
        // Only one device can/should be connected at one time
        serviceRef.current?.disconnect();

        const existingToken=await getTVToken(device.id);

        const service=new SamsungWSService(
            {ip:device.ipAddress,appName:APP_NAME,token:existingToken ?? undefined},
            {
                onConnect:()=>setIsConnected(true),
                onDisconnect:()=>setIsConnected(false),
                onError:(message)=>setLastError(message),
                onToken:(token)=>{
                    if(currentDeviceIdRef.current){
                        saveTVToken(currentDeviceIdRef.current,token).catch(()=>{});
                    }
                },
            }
        );

        serviceRef.current=service;

        try{
            await service.connect();
        }catch(err){
            const message=err instanceof Error ? err.message : "Failed to connect to TV"
            setLastError(message);
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

    const value=useMemo(
        ()=>({isConnected,lastError,connect,disconnect,sendKey}),
        [isConnected,lastError,connect,disconnect,sendKey]
    );

    return <SamsungTVContext.Provider value={value}>{children}</SamsungTVContext.Provider>
}