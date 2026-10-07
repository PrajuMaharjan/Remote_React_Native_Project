import {useCallback,useEffect,useRef,useState} from "react";
import dgram from "react-native-udp";
import {Device} from "../components/general/DeviceBar";
import {SAMSUNG_WS_PORT,SAMSUNG_WS_PATH,PROBE_TIMEOUT_MS} from "../constants/network";
import {getTVToken} from "../services/StorageService";
import {base64Encode} from "../utils/base64";
import {APP_NAME} from "../config/appConfig";

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

    const socketRef=useRef<any>(null);
    const scanTimeoutRef=useRef<ReturnType<typeof setTimeout> | null>(null);
    const candidateIPsRef=useRef<Set<string>>(new Set());
    const probeSocketsRef=useRef<Set<WebSocket>>(new Set());
    const mountedRef=useRef(true);

    const probeTV=useCallback(async(ip:string) : Promise<Device | null>=>{
        let token:string | null=null;
        
        try{
            token=await getTVToken(ip);
        }catch{
            token=null;
        }

        return new Promise<Device | null>((resolve)=>{
            let settled=false;
            const settle=(result:Device | null)=>{
                if(settled) return;
                settled=true;
                resolve(result);
            };

            const encodedName=base64Encode(APP_NAME);
            const tokenParam=token ? `&token=${token}` : "";
            const url=`wss://${ip}:${SAMSUNG_WS_PORT}/${SAMSUNG_WS_PATH}?name=${encodedName}${tokenParam}`;

            const socket=new WebSocket(url);
            probeSocketsRef.current.add(socket);

            const cleanupSocket=()=>{
                probeSocketsRef.current.delete(socket);
                socket.close();
            };

            const timeout=setTimeout(()=>{
                cleanupSocket();
                settle(null);
            },PROBE_TIMEOUT_MS);

            socket.onopen=()=>{
                clearTimeout(timeout);
                cleanupSocket();
                console.log("Probe succeeded for ",ip);
                settle({
                    id:ip,
                    name:`Samsung TV (${ip})`,
                    brand:"samsung",
                    ipAddress:ip,
                });
            };

            socket.onerror=(event:any)=>{
                clearTimeout(timeout);
                cleanupSocket();
                console.log("Probe failed/errored for",ip,"— message:",event?.message);
                settle(null);                
            };

            socket.onclose=(event:any)=>{
                console.log("Probe socket closed for",ip,"— code:",event?.code,"reason:",event?.reason);
            };
            
        });
    },[]);

    const finishSsdpAndProbe=useCallback(async() => {

        if(scanTimeoutRef.current){
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current=null;
        }

        socketRef.current?.close();
        socketRef.current=null;

        const candidateIPs=Array.from(candidateIPsRef.current);
        candidateIPsRef.current=new Set();
        console.log("Probe phase starting, candidates:",candidateIPs);

        if(candidateIPs.length===0){
            console.log("No candidates,skipping probe phase");
            if(mountedRef.current) setIsScanning(false);
            return;
        }

        const results=await Promise.all(candidateIPs.map(probeTV));
        console.log("Probe phase results",results);
        const foundDevices=results.filter((d):d is Device=>d!==null);

        if(mountedRef.current){
            setDiscoveredDevices(foundDevices);
            setIsScanning(false);
        }
    },[probeTV]);

    const abortScan=useCallback((reason:string)=>{
        console.log("abortScan called, reason",reason);
        
        if(scanTimeoutRef.current){
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current=null;
        }
        
        socketRef.current?.close();
        socketRef.current=null;
        candidateIPsRef.current=new Set();
        if(mountedRef.current) setIsScanning(false);
    },[]);

    const startScan=useCallback(()=>{
        setDiscoveredDevices([]); // Clear results from previous scans
        setIsScanning(true);
        candidateIPsRef.current=new Set();

        const socket:any=dgram.createSocket({type:"udp4"});
        socketRef.current=socket;

        socket.on("message",(msg:any,rinfo:{address:string})=>{
            const response=msg.toString();
            const isSamsung=isSamsungResponse(response);
            console.log("SSDP reply from",rinfo.address,"- Samsung match : ",isSamsung);

            if(!isSamsung) return;
            candidateIPsRef.current.add(rinfo.address);
        });

        socket.on("error",(err:any)=>{
            console.log("SSDP scan error : ",err);
            abortScan("Socket error");
        });

        socket.once("listening",()=>{

            socket.addMembership(SSDP_MULTICAST_ADDRESS);

            const searchMessage="M-SEARCH * HTTP/1.1\r\n" +
                                `HOST: ${SSDP_MULTICAST_ADDRESS}:${SSDP_MULTICAST_PORT}\r\n` +
                                `MAN: "ssdp:discover"\r\n` +
                                "MX: 3\r\n" +
                                `ST: ${SSDP_SEARCH_TARGET}\r\n` +
                                "\r\n";

            socket.send(searchMessage,undefined,undefined,SSDP_MULTICAST_PORT,SSDP_MULTICAST_ADDRESS,(err:any)=>{
                if(err) console.log("SSDP send error : ",err);
                else console.log("SSDP send succeeded");
            });
        });

        socket.bind(0); // Do not harcode a port

        scanTimeoutRef.current=setTimeout(()=>{finishSsdpAndProbe();},SCAN_DUARTION_MS);
    },[abortScan,finishSsdpAndProbe]);

    // Clean up for mid scan unmount
    useEffect(()=>{
        mountedRef.current=true;
        return()=>{
            mountedRef.current=false;
            if(scanTimeoutRef.current){
                clearTimeout(scanTimeoutRef.current);
                scanTimeoutRef.current=null;
        }

        socketRef.current?.close();
        socketRef.current=null;
        probeSocketsRef.current.forEach((s)=>s.close());
        probeSocketsRef.current=new Set();
        };
    },[]);

    return {discoveredDevices,isScanning,startScan};
}