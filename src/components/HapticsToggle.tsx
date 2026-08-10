import {TouchableOpacity,Text,View,StyleSheet} from "react-native";

type HapticsToggleProps={
    hapticsEnabled:boolean;
    onToggle:()=>void;
};

export default function HapticsToggle({hapticsEnabled,onToggle}:HapticsToggleProps){
    return(
        <TouchableOpacity style={styles.button} onPress={onToggle} aria-label="Toggle haptic feedback">
            <View style={styles.emojiWrap}>
                <Text style={styles.emoji}>📳</Text>
                {hapticsEnabled && (
                    <Text style={styles.cross}>✕</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        position:"absolute",
        top:56,
        left:20,
        zIndex:10,
        width:42,
        height:42,
        padding:8,
        borderRadius:21,
        backgroundColor:"rgba(20,20,32,0.7)",
        borderWidth:1,
        borderColor:"rgba(124,111,255,0.4)",
        alignItems:"center",
        justifyContent:"center",
    },
    emojiWrap:{
        width:24,
        height:24,
        alignItems:"center",
        justifyContent:"center",
    },
    emoji:{
        fontSize:20,
    },
    cross:{
        position:"absolute",
        fontSize:30,
        color:"#f87171",
        fontWeight:"bold",
        textAlign:"center",
    },
});