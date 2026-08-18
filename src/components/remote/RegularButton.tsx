import {TouchableOpacity,Text,StyleSheet,ViewStyle} from "react-native";

type RegularButtonProps={
    icon:string;
    label:string;
    onPress:()=>void;
    style?:ViewStyle;
};

export default function RegularButton({icon,label,onPress,style}:RegularButtonProps){
    return(
        <TouchableOpacity style={[styles.button,style]} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        width:64,
        height:64,
        borderRadius:14,
        backgroundColor:"#141420",
        borderWidth:0.5,
        borderColor:"#2a2a40",
        alignItems:'center',
        justifyContent:'center',
        gap:4,
    },
    icon:{
        fontSize:22,
        color:'#e0dff5',
    },
    label:{
        fontSize:9,
        color:"#666",
        textAlign:"center",
    }
});