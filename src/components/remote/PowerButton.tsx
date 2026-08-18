import {TouchableOpacity,Text,StyleSheet} from "react-native";

type PowerButtonProps={
    onPress:()=>void;
};

export default function PowerButton({onPress}:PowerButtonProps){
    return(
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.icon}>⏻</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        width:56,
        height:56,
        borderRadius:28,
        backgroundColor:"rgba(248,113,13,0.12)",
        borderWidth:0.5,
        borderColor:"rgba(248,113,113,0.4)",
        alignItems:'center',
        justifyContent:'center',
    },
    icon:{
        fontSize:24,
        color:'#f87171',
    },
});