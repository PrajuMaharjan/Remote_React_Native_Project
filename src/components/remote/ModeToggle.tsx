import {useState,useEffect,useRef} from "react";
import {TouchableOpacity,Image,StyleSheet,Animated} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

type ModeToggleProps={
    isKeyboardMode:boolean;
    onToggle:()=>void;
};

const TRACK_WIDTH=64;
const TRACK_HEIGHT=32;
const THUMB_SIZE=28;
const THUMB_PADDING=2;

// Toggle between keyboard and DPad
export default function ModeToggle({isKeyboardMode,onToggle}:ModeToggleProps){
    
    const slideAnim=useRef(new Animated.Value(isKeyboardMode?1:0)).current;
    
    // Check state of isKeyboardMode and change icon accordingly
    useEffect(()=>{
        Animated.timing(slideAnim,{
            toValue:isKeyboardMode?1:0,
            duration:200,
            useNativeDriver:true,
        }).start();
    },[isKeyboardMode]);

    const translateX=slideAnim.interpolate({
        inputRange:[0,1],
        outputRange:[THUMB_PADDING,TRACK_WIDTH-THUMB_SIZE-THUMB_PADDING],
    });

    return(
        <TouchableOpacity   style={styles.track}
                            onPress={onToggle}
                            activeOpacity={0.7}
        >
            <Animated.View style={[styles.thumb,{transform:[{translateX}]}]}>
                {isKeyboardMode ?(
                    <MaterialIcons name="keyboard" size={16} color="#a78bfa" />
                ) :(
                    <Image  source={require("../../../assets/images/DPadIcon.png")}
                            style={styles.dpadIcon}
                    />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    track:{
        width:TRACK_WIDTH,
        height:TRACK_HEIGHT,
        borderRadius:TRACK_HEIGHT/2,
        backgroundColor:"#141420",
        borderWidth:0.5,
        borderColor:"#2a2a40",
        justifyContent:"center",
    },
    thumb:{
        position:'absolute',
        width:THUMB_SIZE,
        height:THUMB_SIZE,
        borderRadius:THUMB_SIZE/2,
        backgroundColor:'rgba(124,111,255,0.25)',
        borderWidth:0.5,
        borderColor:'rgba(124,111,255,0.5)',
        alignItems:'center',
        justifyContent:"center",
    },
    dpadIcon:{
        width:14,
        height:14,
        resizeMode:"contain",
    },
});