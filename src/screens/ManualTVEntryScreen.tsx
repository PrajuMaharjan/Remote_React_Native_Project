import {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import BackButton from "../components/general/BackButton";
import {Device} from "../components/general/DeviceBar";
import useSamsungTV from "../hooks/useSamsungTV";
import useTVStorage from "@/hooks/useTVStorage";

type ManualTVEntryScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "ManualTVEntry">;
};

const IP_REGEX=/^(\d{1,3}\.){3}\d{1,3}$/;

export default function ManualTVEntryScreen({ navigation }: ManualTVEntryScreenProps) {

    const [name,setName]=useState("");
    const [ip,setIP]=useState("");
    const [isConnecting,setIsConnecting]=useState(false);
    const {connect}=useSamsungTV();
    const {saveDevice}=useTVStorage();

    const handleTestAndSave=async () => {
        if(!IP_REGEX.test(ip.trim())){
            Alert.alert("Invalid IP Address","Please enter a valid IP address(e.g. 192.168.1.42).");
            return;
        }
        const device:Device={
            id:ip.trim(),
            name:name.trim() || `Samsung TV (${ip.trim()})`,
            brand:"samsung",
            ipAddress:ip.trim(),
        };
        setIsConnecting(true);

        try{
            await connect(device);
            await saveDevice(device);
            navigation.navigate("Remote");
        }catch(err){
            Alert.alert("Connection Failed",err instanceof Error? err.message : "Could not connect to this TV.");
        }finally{
            setIsConnecting(false);
        }
    };

    return (
        <View style={styles.container}>
    
            <View style={styles.header}>
                <BackButton onPress={()=>navigation.goBack()} />
                <Text style={styles.title}>Add TV Manually</Text>
            </View>


            <View style={styles.form}>
                <Text style={styles.label}>Name(optional)</Text>
                <TextInput  style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Living Room TV"
                            placeholderTextColor="#444"
                />

                <Text style={styles.label}>IP Address</Text>
                <TextInput  style={styles.input}
                            value={ip}
                            onChangeText={setIP}
                            placeholder="192.168.1.42"
                            placeholderTextColor="#444"
                            keyboardType="numeric"
                            autoCorrect={false}
                            autoCapitalize="none"
                />

                <TouchableOpacity   style={styles.button}
                                    onPress={handleTestAndSave}
                                    disabled={isConnecting}
                                    activeOpacity={0.7}
                >
                    {isConnecting ?(
                        <ActivityIndicator color="#a78bfa" />
                    ) : (
                        <Text style={styles.buttonLabel}>Test & Save</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d0d0f",
    },
    header:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        paddingTop:50,
        paddingBottom:16,
        height:100,
        borderBottomWidth:0.5,
        borderBottomColor:"#1e1e28",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#e0dff5",
    },
    form:{
        padding:20,
        gap:8,
    },
    label:{
        fontSize:13,
        color:"#888",
        marginTop:12,
    },
    input:{
        fontSize:16,
        paddingVertical:12,
        paddingHorizontal:16,
        borderRadius:12,
        backgroundColor:"#141420",
        borderWidth:0.5,
        borderColor:"#2a2a40",
        color:"#e0dff5",
    },
    button:{
        marginTop:24,
        backgroundColor:"rgba(124,111,255,0.2)",
        borderWidth:0.5,
        borderColor:"rgba(124,111,255,0.5)",
        borderRadius:12,
        paddingVertical:14,
        alignItems:"center",
    },
    buttonLabel:{
        color:"#a78bfa",
        fontSize:15,
        fontWeight:"600"
    },
});