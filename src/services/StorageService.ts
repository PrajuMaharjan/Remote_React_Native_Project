import * as SecureStore from "expo-secure-store";
import {tvTokenKey} from "../constants/storageKeys";

// TV pairing tokens

export async function saveTVToken(tvId:string,token:string):Promise<void>{
    return await SecureStore.setItemAsync(tvTokenKey(tvId),token);
}

export async function getTVToken(tvId:string):Promise<string | null>{
    return await SecureStore.getItemAsync(tvTokenKey(tvId));
}

export async function deleteTVToken(tvId:string,):Promise<void>{
    return await SecureStore.deleteItemAsync(tvTokenKey(tvId));
}