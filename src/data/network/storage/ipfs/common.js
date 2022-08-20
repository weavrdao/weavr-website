import { base58 } from "ethers/lib/utils"
import "dotenv/config";

export const getBytes32FromIpfsHash = (ipfsListing) => {
  const bytesArray = base58
    .decode(ipfsListing)
    .slice(2)
  return `0x${Buffer.from(bytesArray).toString("hex")}`;
}
  
export const getIpfsHashFromBytes32 = (bytes32Hex) => {
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, "hex")
  const hashStr = base58.encode(hashBytes)
  return hashStr
}

export const getIpfsAuthHeader = () => {
  if(!process.env.VUE_APP_PROJECT_ID) throw new Error("PROJECT_ID not set in environment variables");
  if(!process.env.VUE_APP_PROJECT_SECRET) throw new Error("PROJECT_SECRET not set in environment variables");
  return `Basic ${Buffer.from(process.env.PROJECT_ID + ":" + process.env.PROJECT_SECRET).toString("base64")}`;
};
