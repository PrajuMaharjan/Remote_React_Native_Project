import {Pressable,View,Text,StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import BrandLogo,{Brand} from "./BrandLogo";

export type Device={
    id:string;
    name:string;
    brand:Brand;
    ipAddress?:string;
};

type DeviceBarProps={
    device:Device;
    onPress:(device:Device)=>void;
};

export default function DeviceBar({device,onPress}:DeviceBarProps){
    return(
        <Pressable style={({pressed})=>[styles.bar,pressed && styles.barPressed]} onPress={()=>onPress(device)}>
            <BrandLogo brand={device.brand} />

            <View style={styles.info}>
                <Text style={styles.name}>{device.name}</Text>
                {device.ipAddress &&(
                    <Text style={styles.ip}>{device.ipAddress}</Text>
                )}
            </View>

            <Ionicons name="chevron-forward" size={18} color="#444" />
        </Pressable>
    );
}

const styles=StyleSheet.create({
    bar:{
        flexDirection:"row",
        alignItems:"center",
        gap:14,
        backgroundColor:"#141420",
        borderColor:"#2a2a40",
        borderWidth:0.5,
        borderRadius:14,
        marginHorizontal:16,
        marginBottom:10,
        padding:14,
    },
    button:{
        width:"85%",
        paddingVertical:16,
        borderRadius:14,
        backgroundColor:"rgba(124,111,255,0.4)",
        borderWidth:0.5,
        borderColor:"rgba(124,111,255,0.4)",
        alignItems:"center",
    },
    barPressed:{
        backgroundColor:"#1a1a2e",
        borderColor:"rgba(124,111,255,0.4)",
    },
    info:{
        flex:1,
        gap:3,
    },
    name:{
        fontSize:15,
        fontWeight:"600",
        color:"#e0dff5",
    },
    ip:{
        color:"#555",
        fontSize:12,
    },
});