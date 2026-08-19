import {View,TouchableOpacity,Text,StyleSheet} from "react-native";

type DPadProps={
    onUp:()=>void;
    onDown:()=>void;
    onLeft:()=>void;
    onRight:()=>void;
    onOk:()=>void;
};

export default function DPad({onUp,onDown,onLeft,onRight,onOk}:DPadProps){
    return(
        <View style={styles.container}>
            
            {/* Up button */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.dirButton} onPress={onUp} activeOpacity={0.7}>
                    <Text style={styles.arrow}>▲</Text>
                </TouchableOpacity>
            </View>

            {/* Left, OK and Right button */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.dirButton} onPress={onLeft} activeOpacity={0.7}>
                    <Text style={styles.arrow}>◀</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.okButton} onPress={onOk} activeOpacity={0.7}>
                    <Text style={styles.okLabel}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dirButton} onPress={onRight} activeOpacity={0.7}>
                    <Text style={styles.arrow}>▶</Text>
                </TouchableOpacity>
            </View>

            {/* Down Button */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.dirButton} onPress={onDown} activeOpacity={0.7}>
                    <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        alignItems:"center",
        gap:4,
    },
    row:{
        flexDirection:"row",
        alignItems:'center',
        gap:4
    },
    dirButton:{
        width:60,
        height:60,
        borderRadius:30,
        backgroundColor:'#141420',
        borderWidth:0.5,
        borderColor:'#2a2a40',
        alignItems:'center',
        justifyContent:'center',
    },
    arrow:{
        fontSize:20,
        color:'#e0dff5',
    },
    okButton:{
        width:68,
        height:68,
        borderRadius:34,
        backgroundColor:'rgba(124,111,255,0.15)',
        borderWidth:1,
        borderColor:'rgba(124,111,255,0.45)',
        alignItems:'center',
        justifyContent:'center',
    },
    okLabel:{
        fontSize:16,
        fontWeight:"700",
        color:"#a78bfa",
    },
});