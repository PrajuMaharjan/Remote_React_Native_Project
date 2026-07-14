import {View,Text,StyleSheet} from "react-native";

export type Brand= "samsung" | "palsonic" | "other";

type BrandLogoProps={
    brand:Brand;
};

const BRAND_CONFIG:Record<Brand,{label:string;color:string;bg:string;}>={
    samsung:{
        label:"SAMSUNG",
        color:"#148A0",
        bg:"#e8eaf6",
    },
    palsonic:{
        label:"PALSONIC",
        color:"#e0dff5",
        bg:"#2a2a3a",
    },
    other:{
        label:"TV",
        color:"#888",
        bg:"#1e1e28",
    },
};

export default function BrandLogo({brand}:BrandLogoProps){
    const config=BRAND_CONFIG[brand] ?? BRAND_CONFIG.other;

    return(
        <View style={[styles.logoBox,{backgroundColor:config.bg}]}>
            <Text style={[styles.logoText,{color:config.color}]} numberOfLines={1} adjustsFontSizeToFit>{config.label}</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    logoBox:{
        width:56,
        height:40,
        borderRadius:8,
        paddingVertical:16,
        alignItems:"center",
        justifyContent:"center",
        paddingHorizontal:4,
    },
    logoText:{
        fontSize:8,
        fontWeight:"800",
        letterSpacing:0.5,
        textAlign:"center",
    },
});