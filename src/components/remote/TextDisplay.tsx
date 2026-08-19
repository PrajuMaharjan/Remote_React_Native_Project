import {TouchableOpacity,Text,StyleSheet} from "react-native";

interface TextDisplayProps{
    text:string;
    onPress:()=>void;
}

export default function TextDisplay({text,onPress} : TextDisplayProps){
    return(
        <TouchableOpacity style={styles.display} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.text} numberOfLines={1}>
                {text.length>0 ? text : "Tap to type..."}
            </Text>

            <Text style={styles.cursor}>|</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    display:{
        flexDirection:"row",
        paddingVertical:12,
        paddingHorizontal:16,
        borderRadius:12,
        width:"100%",
        minHeight:52,
        backgroundColor:'#141420',
        borderWidth:0.5,
        borderColor:'rgba(124,111,255,0.4)',
        alignItems:'center',
    },
    text:{
        flex:1,
        fontSize:16,
        color:"#e0dff5",
    },
    cursor:{

    }
})