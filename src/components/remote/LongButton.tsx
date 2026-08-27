import {TouchableOpacity,Text,StyleSheet,View} from "react-native";

type LongButtonProps={
    topIcon:string;
    bottomIcon:string;
    centerLabel:string
    onTopPress:()=>void;
    onBottomPress:()=>void;
};

export default function LongButton({topIcon,bottomIcon,centerLabel,onTopPress,onBottomPress}:LongButtonProps){
    return(
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.half} onPress={onTopPress} activeOpacity={0.7}>
                <Text style={styles.icon}>{topIcon}</Text>
            </TouchableOpacity>

            <Text style={styles.centerLabel}>{centerLabel}</Text>

            <TouchableOpacity style={styles.half} onPress={onBottomPress} activeOpacity={0.7}>
                <Text style={styles.icon}>{bottomIcon}</Text>
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
    },
    icon:{
        fontSize:20,
        color:'#e0dff5',
    },
    centerLabel:{
        fontSize:11,
        fontWeight:"700",
        color:"#666",
        letterSpacing:0.5
    },
});