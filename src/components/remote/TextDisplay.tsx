import {TextInput,StyleSheet} from "react-native";

interface TextDisplayProps{
    value:string;
    onChangeText:(text:string)=>void;
}

export default function TextDisplay({value,onChangeText} : TextDisplayProps){
    return(
        <TextInput  style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Tap to type..."
                    placeholderTextColor="#444"
                    autoCorrect={false}
                    autoCapitalize="none"
        />
    );
}

const styles=StyleSheet.create({
    input:{
        fontSize:16,
        paddingVertical:14,
        paddingHorizontal:16,
        borderRadius:12,
        width:"100%",
        minHeight:52,
        backgroundColor:'#141420',
        borderWidth:0.5,
        borderColor:'rgba(124,111,255,0.4)',
        color:'#e0dff5',
    },
});