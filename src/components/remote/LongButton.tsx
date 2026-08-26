import {TouchableOpacity,Text,StyleSheet,View} from "react-native";

type LongButtonProps={
    topIcon:string;
    bottomIcon:string;
    topLabel:string;
    bottomLabel:string;
    onTopPress:()=>void;
    onBottomPress:()=>void;
};

export default function LongButton({topIcon,bottomIcon,topLabel,bottomLabel,onTopPress,onBottomPress}:LongButtonProps){
    return(
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.half} onPress={onTopPress} activeOpacity={0.7}>
                <Text style={styles.icon}>{topIcon}</Text>
                <Text style={styles.label}>{topLabel}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.half} onPress={onTopPress} activeOpacity={0.7}>
                <Text style={styles.icon}>{topIcon}</Text>
                <Text style={styles.label}>{topLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        width:56,
        height:140,
        borderRadius:12,
        backgroundColor:"#141420",
        borderWidth:0.5,
        borderColor:"#2a2a40",
        alignItems:'center',
        overflow:'hidden',
    },
    half:{
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:"center",
        gap:2,
    },
    icon:{
        fontSize:20,
        color:'#e0dff5',
    },
    label:{
        fontSize:9,
        color:"#666",
        textAlign:"center",
    },
    divider:{
        width:"60%",
        height:0.5,
        backgroundColor:"#2a2a40",
    }
});