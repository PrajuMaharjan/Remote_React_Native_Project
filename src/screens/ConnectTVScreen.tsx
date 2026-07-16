import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import BackButton from "../components/BackButton";
import SectionHeader from "../components/SectionHeader";
import DeviceBar,{Device} from "../components/DeviceBar";

type ConnectTVScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ConnectTV">;
};

// THIS IS PLACEHOLDER DATA - TO BE REPLACED BY LOGIC LATER
const PAIRED_DEVICES:Device[]=[
  {id:"1",name:"Living Room TV",brand:"samsung",ipAddress:"192.168.1.42"},
  {id:"2",name:"Bedroom TV",brand:"palsonic",ipAddress:"192.168.1.57"},
];

const AVAILABLE_DEVICES:Device[]=[
  {id:"3",name:"Samsung Smart TV",brand:"samsung",ipAddress:"192.168.1.88"},
];

export default function ConnectTVScreen({ navigation }: ConnectTVScreenProps) {
  const handleDevicePress=(device:Device)=>{
    // TO BE REPLACED BY CONNECTION LOGIC
    console.log("Selected device:",device.name); 
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <BackButton onPress={()=>navigation.goBack()} />
        <Text style={styles.title}>Connect to TV</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <SectionHeader title="Previously Connected" />
        {PAIRED_DEVICES.length>0 ? (
          PAIRED_DEVICES.map((device)=>(
            <DeviceBar key={device.id} device={device} onPress={handleDevicePress} />
          ))
        ) : (
          <Text style={styles.emptyText}>No devices found on this network</Text>
        )}
        
        <SectionHeader title="Available Devices" />
        {AVAILABLE_DEVICES.length>0 ? (
          AVAILABLE_DEVICES.map((device)=>(
            <DeviceBar key={device.id} device={device} onPress={handleDevicePress} />
          ))
        ) : (
          <Text style={styles.emptyText}>No devices found on this network</Text>
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