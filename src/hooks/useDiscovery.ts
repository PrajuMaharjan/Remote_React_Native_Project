import {useCallback,useEffect,useRef,useState} from "react";
import ReactMativeUdpTurbo from "react-native-udp-turbo";
import {Buffer} from "buffer";
import PinnedWebSocket from "../../modules/pinned-websocket";
import {Device} from "../components/general/DeviceBar";
import {SAMSUNG_WS_PORT,SAMSUNG_WS_PATH,PROBE_TIMEOUT_MS} from "../constants/network";
import {getTVToken} from "../services/StorageService";
import {base64Encode} from "../utils/base64";
import {APP_NAME} from "../config/appConfig";
import { brand } from "expo-device";

const SSDP_MULTICAST_ADDRESS="239.255.255.250";
const SSDP_MULTICAST_PORT=1900;

const SSDP_SEARCH_TARGET="ssdp:all";
const SCAN_DUARTION_MS=4000;

function isSamsungResponse(response:string){
    const serverMatch=response.match(/SERVER:\s*([^\r\n]+)/i);
    return !!serverMatch && serverMatch[1].toLowerCase().includes("samsung");
}

export default function useDiscovery(){
    const [discoveredDevices,setDiscoveredDevices]=useState<Device[]>([]);
    const [isScanning,setIsScanning]=useState(false);

    const socketIdRef=useRef<number | null>(null);
    const scanTimeoutRef=useRef<ReturnType<typeof setTimeout> | null>(null);
    const candidateIPsRef=useRef<Set<string>>(new Set());
    const probeSocketsRef=useRef<Set<PinnedWebSocket>>(new Set());
    const mountedRef=useRef(true);
    const receivingRef=useRef(false);

    const receiveLoop=useCallback(async(id:number)=>{
        while(receivingRef.current){
            let base64Message:string;
            try{
                base64Message=await Promise.race([
                    ReactMativeUdpTurbo.receive(id),
                    new Promise<never>((_,reject)=>{
                        const checkAbort=setInterval(()=>{
                            if(!receivingRef.current){
                                clearInterval(checkAbort);
                                reject(new Error("aborted"));
                            }
                        },200);
                    }),
                ]);
            }catch{
                break;
            }
        
            const response=Buffer.from(base64Message,"base64").toString("ascii");
            const isSamsung=isSamsungResponse(response);
            console.log("SSDP reply - Samsung match : ",isSamsung);
            if(!isSamsung) continue;

            const locationMatch=response.match(/LOCATION:\s*https?:\/\/([^:\/\r\n]+)/i);
            if(locationMatch) candidateIPsRef.current.add(locationMatch[1]);
        }
    },[]);

    const probeTV=useCallback(async(ip:string) : Promise<Device | null>=>{
        let token:string | null=null;
        
        try{
            token=await getTVToken(ip);
        }catch{
            token=null;
        }

        const encodedName=base64Encode(APP_NAME);
        const tokenParam=token ? `&token=${token}` : "";
        const url=`wss://${ip}:${SAMSUNG_WS_PORT}/${SAMSUNG_WS_PATH}?name=${encodedName}${tokenParam}`;


        return new Promise<Device | null>((resolve)=>{
            let settled=false;
            let socket:PinnedWebSocket | null=null;
            let timeout:ReturnType<typeof setTimeout> | null=null;

            const cleanup=()=>{
                if(timeout){
                    clearTimeout(timeout);
                    timeout=null;
                }
                if(socket){
                    probeSocketsRef.current.delete(socket);
                    socket.close();
                    socket=null;
                }
            };

            const settle=(result:Device | null)=>{
                if(settled) return;
                settled=true;
                cleanup();
                resolve(result);
            };

            try{
                socket = new PinnedWebSocket(url);
            }catch(err){
                console.log("Probe setup threw for ",ip,":",err);
                settle(null);
                return;
            }

            probeSocketsRef.current.add(socket);
            timeout=setTimeout(()=>settle(null),PROBE_TIMEOUT_MS);

            socket.onopen=()=>{
                console.log("Probe succeeded for ",ip);
                settle({
                    id:ip,
                    name:`Samsung TV (${ip})`,
                    brand:"samsung",
                    ipAddress:ip,
                });
            };

            socket.onerror=(event)=>{
                console.log("Probe failed/errored for ",ip,"- message: ",event.message);
                settle(null);
            };

            socket.onclose=(event)=>{
                console.log("Probe socket closed for ",ip,"- code: ",event.code,"reason: ",event.reason);
                settle(null);
            };

        });
    },[]);

    const finishSsdpAndProbe=useCallback(async() => {

        if(scanTimeoutRef.current){
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current=null;
        }

        receivingRef.current=false;
        if(socketIdRef.current !== null){
            await ReactMativeUdpTurbo.close(socketIdRef.current);
            socketIdRef.current=null;
        }

        const candidateIPs=Array.from(candidateIPsRef.current);
        candidateIPsRef.current=new Set();
        console.log("Probe phase starting, candidates:",candidateIPs);

        if(candidateIPs.length===0){
            if(mountedRef.current) setIsScanning(false);
            return;
        }

        const results=await Promise.all(candidateIPs.map(probeTV));
        const foundDevices=results.filter((d):d is Device=>d!==null);

        if(mountedRef.current){
            setDiscoveredDevices(foundDevices);
            setIsScanning(false);
        }
    },[probeTV]);

    const startScan=useCallback(async()=>{
        setDiscoveredDevices([]); // Clear results from previous scans
        setIsScanning(true);
        candidateIPsRef.current=new Set();

        const id=ReactMativeUdpTurbo.createSocket({type:"udp4"});
        socketIdRef.current=id;

        try{
            await ReactMativeUdpTurbo.bind(id,0,"0.0.0.0",{});
            await ReactMativeUdpTurbo.addMembership(id,SSDP_MULTICAST_ADDRESS);

            receivingRef.current=true;
            receiveLoop(id);

            const searchMessage="M-SEARCH * HTTP/1.1\r\n" +
                                `HOST: ${SSDP_MULTICAST_ADDRESS}:${SSDP_MULTICAST_PORT}\r\n` +
                                `MAN: "ssdp:discover"\r\n` +
                                "MX: 3\r\n" +
                                `ST: ${SSDP_SEARCH_TARGET}\r\n` +
                                "\r\n";

            const encodedMessage=Buffer.from(searchMessage,"ascii").toString("base64");
            await ReactMativeUdpTurbo.sendBase64(id,encodedMessage,SSDP_MULTICAST_PORT,SSDP_MULTICAST_ADDRESS);
            console.log("SSDP send succeeded");
        }catch(err){
            console.log("SSDP scan error : ",err);
            receivingRef.current=false;
            if(mountedRef.current) setIsScanning(false);
            return;
        }

        scanTimeoutRef.current=setTimeout(()=>{finishSsdpAndProbe();},SCAN_DUARTION_MS);
    },[finishSsdpAndProbe,receiveLoop]);

    useEffect(()=>{
        mountedRef.current=true;

        return()=>{
            mountedRef.current=false;
            receivingRef.current=false;

            if(scanTimeoutRef.current){
                clearTimeout(scanTimeoutRef.current);
                scanTimeoutRef.current=null;
            }

            if(socketIdRef.current!==null){
                ReactMativeUdpTurbo.close(socketIdRef.current);
                socketIdRef.current=null;
            }

            probeSocketsRef.current.forEach((s)=>s.close());
            probeSocketsRef.current=new Set();
        };
    },[]);

    return {discoveredDevices,isScanning,startScan};

}