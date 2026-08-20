import React,{useState,useEffect} from "react";
import {TouchableOpacity,Text,StyleSheet,Modal,TouchableWithoutFeedback,View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Picker} from "@react-native-picker/picker";

const DUMMY_OPTIONS=[
    "Subtitles",
    "Audio Track",
    "Picture Mode",
    "Sleep Timer",
    "Zoom",
    "Aspect Ratio",
    "Info",
    "Favourite",
];

type ColorButtonColor="red" | "green" | "yellow" | "blue";

type ColorButtonProps={
    color:ColorButtonColor;
    defaultLabel:string;
    onPress:(label:string)=>void;
};

const COLOR_MAP:Record<ColorButtonColor,{bg:string;border:string;text:string}>={
    red:{bg:"rgba(248,113,113,0.15)",border:"rgba(248,113,113,0.5)",text:"#f87171"},
    green:{bg:"rgba(74,222,128,0.15)",border:"rgba(74,222,128,0.5)",text:"#4ade80"},
    yellow:{bg:"rgba(251,191,36,0.15)",border:"rgba(251,191,36,0.5)",text:"#fbbf24"},
    blue:{bg:"rgba(96,165,250,0.15)",border:"rgba(96,165,250,0.5)",text:"#60a5fa"},
}

const STORAGE_KEY=(color:string)=>`color_button_${color}`;

export default function ColorButton({color,defaultLabel,onPress}:ColorButtonProps){
    const [label,setLabel]=useState(defaultLabel);
    const [modalVisible,setModalVisible]=useState(false);
    const [selectedOption,setSelectedOption]=useState(defaultLabel);
    const colors=COLOR_MAP[color];
    
    // Get previously srored setting from local storage
    useEffect(()=>{
        AsyncStorage.getItem(STORAGE_KEY(color)).then((stored)=>{
            if(stored) setLabel(stored);
        });
    },[]);

    const handleConfirm=async()=>{
        setLabel(selectedOption);
        await AsyncStorage.setItem(STORAGE_KEY(color),selectedOption);
        setModalVisible(false);
    };

    return(
        <>
            <TouchableOpacity   style={[styles.button,{backgroundColor:colors.bg,borderColor:colors.border}]}
                                onPress={()=>{console.log(`${label} pressed`); onPress(label); }}
                                onLongPress={()=>{setSelectedOption(label); setModalVisible(true); }}
                                activeOpacity={0.7}
                                delayLongPress={500}
            >

                <Text style={[styles.label,{color:colors.text}]} numberOfLines={1} adjustsFontSizeToFit>
                    {label}
                </Text>

            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={()=>setModalVisible(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>
                        Customise {color.charAt(0).toUpperCase()+color.slice(1)} Button
                    </Text>
                    <Picker selectedValue={selectedOption}
                            onValueChange={(val)=>setSelectedOption(val)}
                            style={styles.picker}
                            dropdownIconColor="#a78bfa"
                    >
                        {DUMMY_OPTIONS.map((opt)=>(
                            <Picker.Item key={opt} label={opt} color='#e0dff5' />
                        ))}
                    </Picker>

                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmLabel}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
}

const styles=StyleSheet.create({
    button:{
        flex:1,
        height:40,
        borderRadius:10,
        borderWidth:0.5,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:4,
    },
    overlay:{
        flex:1,
        color:'rgba(0,0,0,0.5)',
    },
    label:{
        fontSize:11,
        fontWeight:'600',
        textAlign:"center",
    },
    modal:{
        backgroundColor:"#141420",
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        borderWidth:0.5,
        borderColor:'#2a2a40',
        padding:24,
    },
    modalTitle:{
        fontSize:16,
        fontWeight:'700',
        color:"#e0dff5",
        marginBottom:16,
        textAlign:'center',
    },
    picker:{
        color:'#e0dff5',
        backgroundColor:'#0d0d0f',
        borderRadius:10,
        marginBottom:16,
    },
    confirmButton:{
        backgroundColor:"rgba(124,111,255,0.2)",
        borderWidth:0.5,
        borderColor:"rgba(124,111,255,0.5)",
        borderRadius:12,
        paddingVertical:14,
        alignItems:'center',
    },
    confirmLabel:{
        color:"#a78bfa",
        fontSize:15,
        fontWeight:'600',
    }
});