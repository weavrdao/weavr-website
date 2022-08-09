import { base58 } from "ethers/lib/utils"

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
