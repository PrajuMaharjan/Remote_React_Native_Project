import {TouchableOpacity,StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type PowerButtonProps={
    onPress:()=>void;
};

export default function PowerButton({onPress}:PowerButtonProps){
    return(
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
            <Ionicons name="power" size={24} color="#f87171" />
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        width:56,
        height:56,
        borderRadius:28,
        backgroundColor:"rgba(248,113,113,0.12)",
        borderWidth:0.5,
        borderColor:"rgba(248,113,113,0.4)",
        alignItems:'center',
        justifyContent:'center',
    },
});