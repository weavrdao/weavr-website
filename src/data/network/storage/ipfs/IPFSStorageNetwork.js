const network = require("../../../../utils/network")
const { create } = require("ipfs-http-client")
import { ethers } from "ethers"
import StorageNetwork from "../storageNetwork"
import { base58 } from "ethers/lib/utils"
const ipfsAPIClient = create("https://ipfs.infura.io:5001/api/v0")



class IPFSStorageNetwork extends StorageNetwork {
  constructor() {
    super()
  }


  getBytes32FromIpfsHash(ipfsListing) {
    const bytesArray = base58
        .decode(ipfsListing)
        .slice(2)
    return `0x${Buffer.from(bytesArray).toString('hex')}`;
  }
  
  getIpfsHashFromBytes32(bytes32Hex) {
    const hashHex = '1220' + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex')
    const hashStr = base58.encode(hashBytes)
    return hashStr
  }

  async addFile(file) { 
    let jsonString = JSON.stringify(file, null, 2)
    console.log("JSON: ", jsonString);
    return await ipfsAPIClient.add(jsonString, { pin: true })
  }
  
  getFile = (
    name
  ) => new Promise((resolve, reject) => {
    console.log("into IPFSStorageNetwork");
    const url = `https://ipfs.infura.io:5001/api/v0/cat`
  
    let params = { 
      arg: name
    }
  
    let headers = { }
    //headers["Authorization"] = `Basic ${auth}`
  
    let data =  { }
    network
      .postRequest(
        url, 
        params, 
        headers, 
        data
      )
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })

  async getFiles(names) {
    console.log("Requesting files from IPFS")

    const url = `https://ipfs.infura.io:5001/api/v0/cat`
    
    let headers = { }
    //headers["Authorization"] = `Basic ${auth}`
  
    let data =  { }

    const requests = names.map(async name => {
      let params = { 
        arg: name
      }

      return new Promise((resolve) => {
        network
          .postRequest(
            url, 
            params, 
            headers, 
            data
          )
          .then(response => {
            resolve(response)
          })
          .catch((thrown) => {
            resolve(null)
          })
      })
    })
    
    const responses = (await Promise.all(requests)).filter(Boolean)
    
    return responses
  }

  async uploadAndGetPathAsBytes(file) {
    const cid = await this.addFile(file);
    return ethers.utils.formatBytes32String(cid.path);
  }
}

export default IPFSStorageNetwork