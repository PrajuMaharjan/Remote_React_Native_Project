import {Pressable,Text,StyleSheet} from "react-native";

type SettingsGearButtonProps={
    onPress:()=>void;
};

export default function SettingsGearButton({onPress}:SettingsGearButtonProps){
    return(
        <Pressable style={({pressed})=>[styles.button,pressed && styles.buttonPressed]} onPress={onPress} hitSlop={10}>
            <Text style={styles.icon}>⚙</Text>
        </Pressable>
    );
}

const styles=StyleSheet.create({
    button:{
        position:"absolute",
        top:56,
        right:20,
        width:42,
        height:42,
        borderRadius:21,
        backgroundColor:"rgba(20,20,32,0.7)",
        borderWidth:0.5,
        borderColor:"rgba(124,111,255,0.4)",
        alignItems:"center",
        justifyContent:"center",
        zIndex:10,
    },
    buttonPressed:{
        backgroundColor:"rgba(124,111,255,0.25)"
    },
    icon:{
        fontSize:20,
        color:"#a78bfa",
    },
});