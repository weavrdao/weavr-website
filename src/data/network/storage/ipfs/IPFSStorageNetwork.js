const network = require("../../../../utils/network")
const { create } = require("ipfs-http-client")
import StorageNetwork from "../storageNetwork"

const ipfsAPIClient = create("https://ipfs.infura.io:5001/api/v0")

class IPFSStorageNetwork extends StorageNetwork {
  constructor() {
    super()
  }

  async addFile(file) { 
    let jsonString = JSON.stringify(file, null, 2)
    return await ipfsAPIClient.add(jsonString, { pin: true })
  }
  
  getFile = (
    name
  ) => new Promise((resolve, reject) => {
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
}

export default IPFSStorageNetwork