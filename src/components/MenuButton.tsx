import {Pressable,Text,StyleSheet} from "react-native";

type MenuButtonProps={
    label:string;
    onPress:()=>void;
};

export default function MenuButton({label,onPress}:MenuButtonProps){
    return(
        <Pressable style={({pressed})=>[styles.button,pressed && styles.buttonPressed]} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

const styles=StyleSheet.create({
    button:{
        width:"85%",
        paddingVertical:16,
        borderRadius:14,
        backgroundColor:"rgba(124,111,255,0.4)",
        borderWidth:0.5,
        borderColor:"rgba(124,111,255,0.4)",
        alignItems:"center",
    },
    buttonPressed:{
        backgroundColor:"rgba(124,111,255,0.28)"
    },
    label:{
        color:"#e0dff5",
        fontSize:16,
        fontWeight:"600",
        letterSpacing:0.5,
    },
});