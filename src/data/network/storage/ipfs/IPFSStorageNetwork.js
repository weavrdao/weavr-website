/* eslint-disable class-methods-use-this */
const network = require("../../../../utils/network")
const { create } = require("ipfs-http-client")
import StorageNetwork from "../storageNetwork";
import { getBytes32FromIpfsHash } from "./common";

class IPFSStorageNetwork extends StorageNetwork {
  constructor() {
    super()
    this.ipfsAPIClient = create("https://ipfs.infura.io:5001/api/v0");
  }

  async addFile(file) { 
    let jsonString = JSON.stringify(file, null, 2)
    console.log("JSON: ", jsonString);
    return await this.ipfsAPIClient.add(jsonString, { pin: true })
  }
  
  getFile = (
    name
  ) => new Promise((resolve, reject) => {
    const url = "https://ipfs.infura.io:5001/api/v0/cat"
  
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

  // eslint-disable-next-line class-methods-use-this
  async getFiles(names) {
    console.log("Requesting files from IPFS")

    const url = "https://ipfs.infura.io:5001/api/v0/cat"
    
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
    return getBytes32FromIpfsHash(cid.path);
  }
}

export default IPFSStorageNetwork