import {Text,StyleSheet} from "react-native";

type ScreenTitleProps={
    title:string;
};

export default function ScreenTitle({title}:ScreenTitleProps){
    return <Text style={styles.title}>{title}</Text>;
}

const styles=StyleSheet.create({
    title:{
        fontSize:30,
        fontWeight:"bold",
        color:"white",
        marginTop:80,
        letterSpacing:1,
        textAlign:"center",
    },
});