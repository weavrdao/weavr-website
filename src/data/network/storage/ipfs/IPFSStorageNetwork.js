const network = require("../../../../utils/network");
const {create} = require("ipfs-http-client");

import StorageNetwork from "../storageNetwork";
import ipfsCluster from "ipfs-cluster-api"
import {getBytes32FromIpfsHash, getInfuraAuthHeader} from "./common";

import "dotenv/config";

const baseInfuraURL = "https://ipfs.infura.io:5001/api/v0";

class IPFSStorageNetwork extends StorageNetwork {
  constructor() {
    super();
    this.ipfsInfuraAPIClient = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: getInfuraAuthHeader(),
      },
    });
    this.ipfsCollabAPIClient = ipfsCluster({
      host: "collab.weavr.org",
      port: 9094,
      protocol: "https",
    });
  }

  async addJson(payload) {
    let jsonString = JSON.stringify(payload, null, 2);
    console.log("JSON: ", jsonString);
    return await this.ipfsInfuraAPIClient.add(jsonString, {pin: true});
  }

  async addArbitraryFile(file) {
    const filesHash = await this.ipfsInfuraAPIClient.add(file, {pin: true})
    await this.ipfsCollabAPIClient.pin.add(filesHash.path);
    return filesHash.path
  }


  async getFiles(names, localStorage) {
    const maxTries = 5;
    return Promise.allSettled(
      names.map(async (name) => {
        
        if (localStorage.getItem(name) === null || localStorage.getItem(name) === undefined) {
          let file;
          try {
            file = await this.getFile(name)
            console.log(`cache miss, pushing ${name} to local storage`);
            localStorage.setItem(name, file)
            return JSON.parse(file)
          }catch (e) {
            console.log("ERROR: ", e)
          }
        } else {
          console.log("cache hit")
          return JSON.parse(localStorage.getItem(name));
        }
      })
    )
  }

  async getFile(cid) {
    const stream = await this.ipfsInfuraAPIClient.cat(cid)
    let data = []
    for await (const chunk of stream) {  
      data.push(String.fromCharCode.apply(null, chunk))
    }
    console.log(data);
    return data[0]
  }

  async uploadAndGetPathAsBytes(payload) {
    try {
      const cid = await this.addJson(payload);
      // eslint-disable-next-line no-unused-vars
      const _ = await this.ipfsCollabAPIClient.pin.add(cid.path);
      return getBytes32FromIpfsHash(cid.path);
    } catch (e) {
      console.log(e);
      throw new Error("Could not upload files to IPFS");
    }
  }
}

export default IPFSStorageNetwork;
