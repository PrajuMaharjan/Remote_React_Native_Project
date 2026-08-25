import {View,TouchableOpacity,Text,StyleSheet} from "react-native";

type DPadProps={
    onUp:()=>void;
    onDown:()=>void;
    onLeft:()=>void;
    onRight:()=>void;
    onOk:()=>void;
};

const WHEEL_SIZE=200;
const SEGMENT_SIZE=WHEEL_SIZE/2;
const OK_SIZE=68;

export default function DPad({onUp,onDown,onLeft,onRight,onOk}:DPadProps){
    return(
        <View style={styles.container}>            

            <View style={styles.outerRing} pointerEvents="none" />

                <View style={styles.wheel}>

                    {/* Up button */}
                    <TouchableOpacity style={[styles.segment,styles.segmentUp]} onPress={onUp} activeOpacity={0.7}>
                        <View style={styles.counterRotate}>
                            <Text style={styles.arrow}>▲</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Right button */}
                    <TouchableOpacity style={[styles.segment,styles.segmentRight]} onPress={onRight} activeOpacity={0.7}>
                        <View style={styles.counterRotate}> 
                            <Text style={styles.arrow}>▶</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Left button */}
                    <TouchableOpacity style={[styles.segment,styles.segmentLeft]} onPress={onLeft} activeOpacity={0.7}>
                        <View style={styles.counterRotate}> 
                            <Text style={styles.arrow}>◀</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Down Button */}
                    <TouchableOpacity style={[styles.segment,styles.segmentDown]} onPress={onDown} activeOpacity={0.7}>
                        <View style={styles.counterRotate}> 
                            <Text style={styles.arrow}>▼</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                {/* Ok Button */}
                <TouchableOpacity style={styles.okButton} onPress={onOk} activeOpacity={0.7}>
                    <Text style={styles.okLabel}>OK</Text>
                </TouchableOpacity>
        
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        width:WHEEL_SIZE,
        height:WHEEL_SIZE,
        alignItems:"center",
        justifyContent:'center'
    },
    outerRing:{
        position:'absolute',
        top:0,
        left:0,
        width:WHEEL_SIZE,
        height:WHEEL_SIZE,
        borderRadius:WHEEL_SIZE/2,
        borderWidth:0.5,
        borderColor:'#2a2a40',
    },
    wheel:{
        width:WHEEL_SIZE,
        height:WHEEL_SIZE,
        borderRadius:WHEEL_SIZE/2,
        overflow:'hidden',
        borderWidth:0.5,
        borderColor:'#2a2a40',
        transform:[{rotate:'45deg'}],
    },
    segment:{
        position:'absolute',
        width:SEGMENT_SIZE,
        height:SEGMENT_SIZE,
        backgroundColor:'#141420',
        alignItems:'center',
        justifyContent:'center',
    },
    segmentUp:{
        top:0,
        left:0,
        borderTopLeftRadius:SEGMENT_SIZE,
    },
    segmentRight:{
        top:0,
        left:SEGMENT_SIZE,
        borderTopRightRadius:SEGMENT_SIZE,
    },
    segmentLeft:{
        top:SEGMENT_SIZE,
        left:0,
        borderBottomLeftRadius:SEGMENT_SIZE,
    },
    segmentDown:{
        top:SEGMENT_SIZE,
        left:SEGMENT_SIZE,
        borderBottomRightRadius:SEGMENT_SIZE,
    },
    counterRotate:{
        transform:[{rotate:"-45deg"}],
    },
    arrow:{
        fontSize:20,
        color:'#e0dff5',
    },
    okButton:{
        position:"absolute",
        width:OK_SIZE,
        height:OK_SIZE,
        borderRadius:OK_SIZE/2,
        backgroundColor:'rgba(124,111,255,0.15)',
        borderWidth:1,
        borderColor:'rgba(124,111,255,0.45)',
        alignItems:'center',
        justifyContent:'center',
        zIndex:2,
    },
    okLabel:{
        fontSize:16,
        fontWeight:"700",
        color:"#a78bfa",
    },
});