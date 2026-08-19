import { act } from "react";
import {TouchableOpacity,Text,StyleSheet} from "react-native";

type ModeToggleProps={
    isKeyboardMode:boolean;
    onToggle:()=>void;
};

// Toggle between keyboard and DPad
export default function ModeToggle({isKeyboardMode,onToggle}:ModeToggleProps){
    return(
        <TouchableOpacity   style={[styles.button,isKeyboardMode && styles.activeButton]}
                            onPress={onToggle}
                            activeOpacity={0.7}
        >
            <Text style={styles.icon}>{isKeyboardMode ? "🕹" : "⌨"}</Text>
            <Text style={[styles.label,isKeyboardMode && styles.activeLabel]}>
                {isKeyboardMode ? "DPad" : "Keyboard"}
            </Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        flexDirection:"row",
        gap:8,
        paddingVertical:12,
        paddingHorizontal:20,
        borderRadius:28,
        backgroundColor:'#141420',
        borderWidth:0.5,
        borderColor:'#2a2a40',
        alignItems:'center',
    },
    activeButton:{
        backgroundColor:"rgba(124,111,255,0.15)",
        borderColor:"rgba(124,111,255,0.4)",
    },
    icon:{
        fontSize:18,
    },
    label:{
        fontSize:14,
        fontWeight:"500",
        color:"#888",
    },
    activeLabel:{
        color:"#a78bfa",
    },
});