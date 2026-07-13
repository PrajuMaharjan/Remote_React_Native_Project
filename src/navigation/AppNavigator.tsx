import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {RootStackParamList} from "./types";

import HomeScreen from "../screens/HomeScreen";
import ConnectTVScreen from "../screens/ConnectTVScreen";
import ConnectACScreen from "../screens/ConnectACScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack=createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
                       screenOptions={{
                                        headerShown:false,
                                        contentStyle:{backgroundColor:"#0d0d0f"},
                                        animation:"slide_from_right",
                                     }} 
      >

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ConnectTV" component={ConnectTVScreen} />
        <Stack.Screen name="ConnectAC" component={ConnectACScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}