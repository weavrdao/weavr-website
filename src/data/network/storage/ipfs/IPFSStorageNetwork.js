/* eslint-disable class-methods-use-this */
const network = require("../../../../utils/network")
const { create } = require("ipfs-http-client")
import StorageNetwork from "../storageNetwork";
import { getBytes32FromIpfsHash } from "./common";
import "dotenv/config";
console.log(process.env);

const baseInfuraURL = "https://ipfs.infura.io:5001/api/v0";

class IPFSStorageNetwork extends StorageNetwork {
  constructor() {
    super()
    this.ipfsAPIClient = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.PROJECT_ID + ":" + process.env.PROJECT_SECRET).toString("base64"),
      },
    });
  }

  async addFile(file) { 
    let jsonString = JSON.stringify(file, null, 2)
    console.log("JSON: ", jsonString);
    return await this.ipfsAPIClient.add(jsonString, { pin: true });
  }
  
  getFile = (
    name
  ) => new Promise((resolve, reject) => {
    const url = `${baseInfuraURL}/cat`;
  
    let params = { 
      arg: name
    }
  
    let headers = {
      Authorization: "Basic " + Buffer.from(process.env.PROJECT_ID + ":" + process.env.PROJECT_SECRET).toString("base64"),
    }
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
        resolve(null)
      })
  })

  // eslint-disable-next-line class-methods-use-this
  async getFiles(names) {
    console.log("Requesting files from IPFS")
    console.log(names);
    
    let headers = {
      Authorization: "Basic " + Buffer.from(process.env.PROJECT_ID + ":" + process.env.PROJECT_SECRET).toString("base64"),
    };

    const data = {};

    const requests = names.map(async name => {
      let params = { 
        arg: name
      }

      return new Promise((resolve, reject) => {
        network
          .postRequest(
            baseInfuraURL, 
            params, 
            headers, 
            data
          )
          .then(response => {
            console.log("resolving");
            resolve(response)
          })
          .catch((thrown) => {
            console.log("rejecting")
            reject(null)
          })
      })
    })
    return (await Promise.allSettled(requests));
  }

  async uploadAndGetPathAsBytes(file) {
    const cid = await this.addFile(file);
    return getBytes32FromIpfsHash(cid.path);
  }
}

export default IPFSStorageNetwork