import {useCallback,useEffect,useRef,useState} from "react";
import dgram from "react-native-udp";
import {Device} from "../components/general/DeviceBar";

const SSDP_MULTICAST_ADDRESS="239.255.255.250";
const SSDP_MULTICAST_PORT=1900;

const SSDP_SEARCH_TARGET="urn:samsung.com:device:RemoteControlReceiver:1";
const SCAN_DUARTION_MS=4000;

export default function useDiscovery(){
    const [discoveredDevices,setDiscoveredDevices]=useState<Device[]>([]);
    const [isScanning,setIsScanning]=useState(false);

    const socketRef=useRef<any>(null);
    const scanTimeoutRef=useRef<ReturnType<typeof setTimeout> | null>(null);

    const stopScan=useCallback(()=>{
        if(scanTimeoutRef.current){
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current=null;
        }
        socketRef.current?.close();
        socketRef.current=null;
        setIsScanning(false);
    },[]);

    const startScan=useCallback(()=>{
        setDiscoveredDevices([]); // Clear results from previous scans
        setIsScanning(true);

        const socket:any=dgram.createSocket({type:"udp4"});
        socketRef.current=socket;

        socket.on("message",(msg:any,rinfo:{address:string})=>{
            const response=msg.toString();
            if(!response.includes(SSDP_SEARCH_TARGET)) return;

            const usnMatch=response.match(/USN:\s*uuid:([^:\r\n]+)/i);
            const id=usnMatch ? usnMatch[1] : rinfo.address;

            setDiscoveredDevices((current)=>{
                if(current.some((d)=>d.id===id)) return current;
                const device:Device={
                    id,
                    name:`Samsung TV (${rinfo.address})`,
                    brand:"samsung",
                    ipAddress:rinfo.address,
                };
                return [...current,device];
            });
        });

        socket.on("error",()=>{
            stopScan();
        });

        socket.once("listening",()=>{
            socket.setBroadcast(true);

            const searchMessage="M-SEARCH * HTTP/1.1\r\n" +
                                `HOST: ${SSDP_MULTICAST_ADDRESS}:${SSDP_MULTICAST_PORT}\r\n` +
                                `MAN: "ssdp:discover"\r\n` +
                                "MX: 3\r\n" +
                                `ST: ${SSDP_SEARCH_TARGET}\r\n` +
                                "\r\n";

            socket.send(searchMessage,undefined,undefined,SSDP_MULTICAST_PORT,SSDP_MULTICAST_ADDRESS);
        });

        socket.bind(0); // Do not harcode a port

        scanTimeoutRef.current=setTimeout(stopScan,SCAN_DUARTION_MS);
    },[stopScan]);

    // Clean up for mid scan unmount
    useEffect(()=>stopScan,[stopScan]);

    return {discoveredDevices,isScanning,startScan};
}