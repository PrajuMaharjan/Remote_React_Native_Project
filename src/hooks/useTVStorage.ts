import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PAIRED_TVS_KEY } from "../constants/storageKeys";
import { Device } from "../components/general/DeviceBar";

export default function useTVStorage(){
    const [pairedDevices,setPairedDevices]=useState<Device[]>([]);
    const [isLoaded,setIsLoaded]=useState(false);

    useEffect(()=>{
        AsyncStorage.getItem(PAIRED_TVS_KEY).then((stored)=>{
            if(stored){
                try{
                    setPairedDevices(JSON.parse(stored));
                }catch{
                    setPairedDevices([]);
                }
            }
            setIsLoaded(true);
        });
    },[]);

    const saveDevice=useCallback(async (device:Device)=>{
        setPairedDevices((current)=>{
            const updated=[...current.filter((d)=>d.id !== device.id),device];
            AsyncStorage.setItem(PAIRED_TVS_KEY,JSON.stringify(updated)).catch(()=>{});
            return updated;
        });
    },[]);

    const removeDevice=useCallback(async (deviceId:string)=>{
        setPairedDevices((current)=>{
            const updated=current.filter((d)=>d.id !== deviceId);
            AsyncStorage.setItem(PAIRED_TVS_KEY,JSON.stringify(updated)).catch(()=>{});
            return updated;
        });
    },[]);

    return {pairedDevices,isLoaded,saveDevice,removeDevice};
}