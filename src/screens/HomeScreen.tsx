import {View,StyleSheet,ImageBackground} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useState} from "react";
import {RootStackParamList} from "../navigation/types";
import ScreenTitle from "../components/general/ScreenTitle";
import MenuButton from "../components/general/MenuButton";
import HapticsToggle from "../components/general/HapticsToggle";

type HomeScreenProps={
    navigation:NativeStackNavigationProp<RootStackParamList,"Home">;
};

export default function HomeScreen({navigation}:HomeScreenProps){
    const [hapticsEnabled,setHapticsEnabled]=useState(true);

    return(
        // <ImageBackground source={require("../../assets/images/HomeBackground.png")} style={styles.background} resizeMode="cover">
            <View style={styles.overlay}>
                <HapticsToggle hapticsEnabled={hapticsEnabled} onToggle={()=>setHapticsEnabled(!hapticsEnabled)} />
                
                <View style={styles.container}>
                    <ScreenTitle title="Universal Remote Control" />

                    <View style={styles.buttonContainer}>
                        <MenuButton label="CONNECT TO TV" onPress={()=>navigation.navigate("ConnectTV")} />
                        <MenuButton label="CONNECT TO AC" onPress={()=>navigation.navigate("ConnectAC")} />    
                    </View>
                </View>
            </View>
        // </ImageBackground>
    );
}

const styles=StyleSheet.create({
    background:{
        flex:1,
        backgroundColor:"#0d0d0f",
    },
    overlay:{
        flex:1,
        backgroundColor:"rgba(13,13,15,0.55)",
    },
    container:{
        flex:1,
        alignItems:"center",
        padding:20,
    },
    buttonContainer:{
        gap:14,
        width:"100%",
        alignItems:"center",
        position:"absolute",
        bottom:160,
    },
});