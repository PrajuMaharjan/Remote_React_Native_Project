import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import BackButton from "../components/general/BackButton";
import SectionHeader from "../components/general/SectionHeader";
import DeviceBar,{Device} from "../components/general/DeviceBar";
import useSamsungTV from "../hooks/useSamsungTV";
import useTVStorage from "@/hooks/useTVStorage";
import useDiscovery from "@/hooks/useDiscovery";

type ConnectTVScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ConnectTV">;
};

export default function ConnectTVScreen({ navigation }: ConnectTVScreenProps) {
  
  const {connect}=useSamsungTV();
  const {pairedDevices,saveDevice}=useTVStorage();
  const {discoveredDevices,isScanning,startScan}=useDiscovery();

  const handleDevicePress=async (device:Device)=>{
    try{
      await connect(device);
      await saveDevice(device);
      navigation.navigate("Remote");
    }catch(err){
      Alert.alert("Connection failed",
        err instanceof Error ? err.message : "Could not connect to this TV."
      );
    }
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <BackButton onPress={()=>navigation.goBack()} />
        <Text style={styles.title}>Connect to TV</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <SectionHeader title="Previously Connected" />
        {pairedDevices.length>0 ? (
          pairedDevices.map((device)=>(
            <DeviceBar key={device.id} device={device} onPress={handleDevicePress} />
          ))
        ) : (
          <Text style={styles.emptyText}>No devices found on this network</Text>
        )}
        
        <SectionHeader title="Available Devices" />

        <View style={styles.actionsRow}>
          
          <TouchableOpacity style={styles.actionButton} onPress={startScan} disabled={isScanning} activeOpacity={0.7}>
            {isScanning ? <ActivityIndicator color="#a78bfa" /> : <Text style={styles.actionLabel}>Scan for TVs</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={()=>navigation.navigate("ManualTVEntry")} activeOpacity={0.7}>
            <Text style={styles.actionLabel}>Add Manually</Text>
          </TouchableOpacity>
          
        </View>

        {discoveredDevices.length>0 ? (
          discoveredDevices.map((device)=>(
            <DeviceBar key={device.id} device={device} onPress={handleDevicePress} />
          ))
        ) : (
          <Text style={styles.emptyText}>
            {isScanning ? "Scanning..." : "No devices found - tap Scan or add one manually"}
          </Text>
        )}

      </ScrollView>
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
    letterSpacing: 0.3,
  },
  scroll:{
    flex:1,
  },
  actionsRow:{
    flexDirection:"row",
    gap:10,
    paddingHorizontal:20,
    marginBottom:8,
  },
  actionButton:{
    flex:1,
    paddingVertical:12,
    backgroundColor:"rgba(124,111,255,0.15)",
    borderColor:"rgba(124,111,255,0.4)",
    borderWidth:0.5,
    alignItems:"center",
  },
  actionLabel:{
    color:"#a78bfa",
    fontSize:14,
    fontWeight:"600",
  },
  scrollContent:{
    paddingBottom:40,
  },
  emptyText:{
    fontSize:13,
    color:"#444",
    paddingHorizontal:20,
    paddingVertical:8,
  },
});