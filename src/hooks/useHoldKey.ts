import {useCallback,useRef,useEffect} from "react";
import useSamsungTV from "./useSamsungTV";
import {SamsungCommand} from "../services/SamsungCommands";

export default function useHoldKey(){
    const {pressKey,releaseKey}=useSamsungTV();
    const heldKey=useRef<SamsungCommand | null>(null);
    const capTimer=useRef<ReturnType<typeof setTimeout> | null>(null);

    const endHold=useCallback(()=>{
        if(capTimer.current){
            clearTimeout(capTimer.current);
            capTimer.current=null;
        }
        if(heldKey.current){
            releaseKey(heldKey.current);
            heldKey.current=null;
        }
    },[releaseKey]);

    const startHold=useCallback((command:SamsungCommand,maxMs:number)=>{
        endHold();
        pressKey(command);
        heldKey.current=command;
        capTimer.current=setTimeout(endHold,maxMs);
    },[pressKey,endHold]);

    // When commands fail, hold ends
    useEffect(()=>endHold,[endHold]);

    return {startHold,endHold};
}