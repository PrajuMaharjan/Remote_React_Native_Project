import styles from "expo-router/build/modal/web/modalStyles";
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
            
        </View>
    )
}