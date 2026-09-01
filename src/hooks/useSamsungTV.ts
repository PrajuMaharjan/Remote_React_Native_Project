import {useContext} from "react";
import {SamsungTVContext} from "../context/SamsungTVContext";

export default function useSamsungTV(){
    const context = useContext(SamsungTVContext);
    if(!context){
        throw new Error("useSamsungTV must be used within a SamsungTVProvider");
    }
    return context;
}