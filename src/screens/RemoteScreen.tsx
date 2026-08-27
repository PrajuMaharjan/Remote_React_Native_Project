import React,{useState} from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import BackButton from "../components/general/BackButton";
import PowerButton from "../components/remote/PowerButton";
import ModeToggle from "../components/remote/ModeToggle";
import DPad from "../components/remote/DPad";
import TextDisplay from "../components/remote/TextDisplay";
import LongButton from "../components/remote/LongButton";
import RegularButton from "../components/remote/RegularButton";
import ColorButton from "../components/remote/ColoredButton";

type RemoteScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Remote">;
};

export default function RemoteScreen({ navigation }: RemoteScreenProps) {
    const [isMuted,setIsMuted]=useState(false);
    const [isKeyboardMode,setIsKeyboardMode]=useState(false);
    const [typedtext,setTypedText]=useState("");

    return (
        <View style={styles.container}>
    
            <View style={styles.header}>
                <BackButton onPress={()=>navigation.goBack()} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Row 1 : Power + Mode Toggle */}
                <View style={styles.row}>
                    <PowerButton onPress={()=>console.log("Power pressed")} />
                    <ModeToggle isKeyboardMode={isKeyboardMode}
                                onToggle={()=>setIsKeyboardMode(!isKeyboardMode)}
                    />
                </View>

                {/* Wrapping the input area in a fixed height container so that nothing below it shifts position */}
                <View style={styles.inputArea}>
                    {/* Row 2 : DPad or Keyboard */}
                    {isKeyboardMode ? (
                        <View style={styles.keyboardSection}>
                            <TextDisplay    value={typedtext}
                                            onChangeText={setTypedText}
                            />
                        </View>
                    ) : (
                        <View style={styles.centeredRow}>
                            <DPad   onUp={()=>console.log("Up pressed")}
                                    onDown={()=>console.log("Down pressed")}
                                    onLeft={()=>console.log("Left pressed")}
                                    onRight={()=>console.log("Right pressed")}
                                    onOk={()=>console.log("OK pressed")}
                            />
                        </View>
                    )}
                </View>

                {/* Row 5 : Source  and Menu*/}
                <View style={styles.sourceMenuRow}>
                    <RegularButton  icon="⬡"
                                    label="Source"
                                    onPress={()=>console.log("Source pressed")}
                    />

                    <View style={styles.sourceMenuSpace} />

                    <RegularButton  icon="☰"
                                    label="Menu"
                                    onPress={()=>console.log("Menu pressed")}
                    />
                </View>

                {/* Row 3 : Vlolume,Several controls and Channel */}
                <View style={styles.controlsRow}>

                    {/* Volume on the left */}
                    <LongButton topIcon="+"
                                bottomIcon="-"
                                centerLabel="VOL"
                                onTopPress={()=>console.log("Volume up pressed")}
                                onBottomPress={()=>console.log("Volume down pressed")}
                    />

                    {/* Mute,home,back,pause and color buttons in the midde */}
                    <View style={styles.middleControls}>
                        
                        <View style={styles.middleGridRow}>

                            {/* Mute and Home buttons*/}
                            <View style={styles.gridColumn}>
                                <RegularButton  icon={isMuted ? "🔇" : "🔊"}
                                                label="Mute"
                                                onPress={()=>{setIsMuted(!isMuted); console.log("Mute pressed");}}
                                />
                                <RegularButton  icon="⌂"
                                                label="Home"
                                                onPress={()=>console.log("Home pressed")}
                                />
                            </View>
                            
                            {/* Back and Pause buttons */}
                            <View style={styles.gridColumn}>
                                <RegularButton  icon="⏸"
                                                label="Pause"
                                                onPress={()=>console.log("Pause pressed")}
                                />
                                <RegularButton  icon="↩"
                                                label="Back"
                                                onPress={()=>console.log("Back pressed")}
                                />

                            </View>
                        </View>
                    </View>

                    {/* Chaneel button on the right */}
                    <LongButton topIcon="˄"
                                bottomIcon="˅"
                                centerLabel="CH"
                                onTopPress={()=>console.log("Channel up pressed")}
                                onBottomPress={()=>console.log("Channel down pressed")}
                    />

                </View>

                {/* Color Buttons */}
                <View style={styles.colorRow}>
                        <ColorButton    color="red"
                                        defaultLabel="Subtitles"
                                        onPress={(label)=>console.log(`${label} pressed.`)}
                        />
                        <ColorButton    color="green"
                                        defaultLabel="Audio"
                                        onPress={(label)=>console.log(`${label} pressed.`)}
                        />
                        <ColorButton    color="blue"
                                        defaultLabel="Picture"
                                        onPress={(label)=>console.log(`${label} pressed.`)}
                        />
                        <ColorButton    color="yellow"
                                        defaultLabel="Sleep"
                                        onPress={(label)=>console.log(`${label} pressed.`)}
                        />
                </View>
                
                {/* Row 4 : Playback Controls */}
                <View style={styles.row}>
                    <RegularButton  icon="⏮"
                                    label="Skip backward"
                                    onPress={()=>console.log("Skip Back pressed")}
                    />
                    <RegularButton  icon="⏪"
                                    label="Rewind"
                                    onPress={()=>console.log("Rewind pressed")}
                    />
                    <RegularButton  icon="⏩"
                                    label="Fast Forward"
                                    onPress={()=>console.log("Fast Forward pressed")}
                    />
                    <RegularButton  icon="⏭"
                                    label="Skip forward"
                                    onPress={()=>console.log("Skip Forward pressed")}
                    />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d0d0f",
    },
    header: {
        height: 100,
        justifyContent: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#1e1e28",
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        gap: 24,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    centeredRow: {
        alignItems: "center",
    },
    keyboardSection: {
        gap: 12,
        width: "100%",
    },
    inputArea:{
        height:200,
        justifyContent:'center',
    },
    controlsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
    },
    middleControls: {
        alignItems: "center",
        gap: 12,
    },
    middleGridRow:{
        flexDirection:"row",
        gap:12,
    },
    gridColumn:{
        gap:12,
    },
    colorRow: {
        flexDirection: "row",
        gap: 6,
        alignSelf:"center",
    },
    sourceMenuRow:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        gap:10,
    },
    sourceMenuSpace:{
        width:140,
    }
});
