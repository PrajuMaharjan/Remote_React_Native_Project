// Encode the name for security purposes
export function base64Encode(input:string):string{
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result="";
    let i=0;

    while(i<input.length){
        const a = input.charCodeAt(i++);
        const b = i<input.length ? input.charCodeAt(i++) : NaN;
        const c = i<input.length ? input.charCodeAt(i++) : NaN;

        result += chars[a >> 2];
        result += chars[((a & 3) << 4) | (isNaN(b) ? 0 : b >>4)];
        result += isNaN(b) ? "=" : chars[((b & 15) <<2) | (isNaN(c) ? 0 : c >> 6)];
        result += isNaN(c) ? "=" : chars[c & 63];
    }

    return result;
}