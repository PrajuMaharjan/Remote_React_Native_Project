import {TouchableOpacity,Text,StyleSheet} from "react-native";

type BackButtonProps={
    onPress:()=>void;
};

export default function BackButton({onPress}:BackButtonProps){
    return(
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    backButton:{
            position:'absolute',
            top:50,
            left:20,
            zIndex:10,
            padding:8,
    },  
        backArrow:{
            fontSize:28,
            color:'white',
            fontWeight:'bold',
    },
});