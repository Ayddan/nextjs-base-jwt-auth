import * as jose from "jose"

async function verifyToken(token){
    try{
        const decoded = await jose.jwtVerify(token, new TextEncoder().encode(process.env.TOKEN_SECRET));
        return decoded
    } catch(err){
        return false
    }
}

export default verifyToken;
