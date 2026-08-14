import {Text,StyleSheet} from "react-native";

type SectionHeaderProps={
    title:string;
};

export default function SectionHeader({title}:SectionHeaderProps){
    return <Text style={styles.title}>{title}</Text>;
}

const styles=StyleSheet.create({
    title:{
        fontSize:13,
        fontWeight:"600",
        color:"#666",
        letterSpacing:0.08,
        textAlign:"center",
        paddingHorizontal:20,
        paddingTop:24,
        paddingBottom:8,
    },
});