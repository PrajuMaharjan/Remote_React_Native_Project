import { View, Text, StyleSheet, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ConnectAC">;
};

export default function ConnectACScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to AC</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backLabel}>← Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0f",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e0dff5",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: "rgba(124,111,255,0.15)",
    borderWidth: 0.5,
    borderColor: "rgba(124,111,255,0.4)",
  },
  backLabel: {
    color: "#a78bfa",
    fontSize: 15,
    fontWeight: "600",
  },
});