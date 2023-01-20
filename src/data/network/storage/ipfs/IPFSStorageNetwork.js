/* eslint-disable class-methods-use-this */
const network = require("../../../../utils/network");
const {create} = require("ipfs-http-client");
import StorageNetwork from "../storageNetwork";
import ipfsCluster from "ipfs-cluster-api"
import {getBytes32FromIpfsHash, getInfuraAuthHeader, getCollabAuthHeader} from "./common";
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
      // headers: {
      //   authorization: getCollabAuthHeader(),
      // }
    });
  }

  async addFile(file) {
    let jsonString = JSON.stringify(file, null, 2);
    console.log("JSON: ", jsonString);
    const test = await this.ipfsInfuraAPIClient.add(jsonString, {pin: true});
    return test;
  }

  async addImage(imageFile) {
    const image = await this.ipfsInfuraAPIClient.add(imageFile, {pin: true});
    return image;
  }

  getFile = (name) =>
    new Promise((resolve) => {
      const url = `${baseInfuraURL}/cat`;

      let params = {
        arg: name,
      };

      let headers = {
        Authorization: getInfuraAuthHeader(),
      };

      let data = {};
      network
        .postRequest(url, params, headers, data)
        .then((res) => {
          resolve(res.value || null);
        })
        .catch((err) => {
          resolve(null);
        });
    });

  // eslint-disable-next-line class-methods-use-this
  async getFiles(names) {
    console.log("Requesting files from IPFS");

    const requestURL = `${baseInfuraURL}/cat`;

    let headers = {
      Authorization: getInfuraAuthHeader(),
    };

    const data = {};

    const requests = names.map(async (name) => {
      let params = {
        arg: name,
      };

      return new Promise((resolve) => {
        network
          .postRequest(requestURL, params, headers, data)
          .then((res) => {
            resolve(res || null);
          })
          .catch(() => {
            console.log("Request failed");
            resolve(null);
          });
      });
    });
    return await Promise.allSettled(requests);
  }

  async uploadAndGetPathAsBytes(file) {
    try {
      const cid = await this.addFile(file);
      const _ = await this.ipfsCollabAPIClient.pin.add(cid.path);
      return getBytes32FromIpfsHash(cid.path);
    } catch (e) {
      console.log(e);
      throw new Error("Could not upload files to IPFS");
    }
  }
}

export default IPFSStorageNetwork;
