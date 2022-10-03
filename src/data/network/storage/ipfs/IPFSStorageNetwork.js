/* eslint-disable class-methods-use-this */
const network = require("../../../../utils/network");
const { create } = require("ipfs-http-client");
import StorageNetwork from "../storageNetwork";
import { getBytes32FromIpfsHash, getIpfsAuthHeader } from "./common";
import "dotenv/config";

const baseInfuraURL = "https://ipfs.infura.io:5001/api/v0";

class IPFSStorageNetwork extends StorageNetwork {
  constructor() {
    super();
    this.ipfsAPIClient = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: getIpfsAuthHeader(),
      },
    });
  }

  async addFile(file) {
    let jsonString = JSON.stringify(file, null, 2);
    console.log("JSON: ", jsonString);
    const test = await this.ipfsAPIClient.add(jsonString, { pin: true });
    return test;
  }

  async addImage(imageFile) {
    const image = await this.ipfsAPIClient.add(imageFile, { pin: true });
    return image;
  }

  getFile = (name) =>
    new Promise((resolve) => {
      const url = `${baseInfuraURL}/cat`;

      let params = {
        arg: name,
      };

      let headers = {
        Authorization: getIpfsAuthHeader(),
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
      Authorization: getIpfsAuthHeader(),
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
      return getBytes32FromIpfsHash(cid.path);
    } catch (e) {
      console.log(e);
      throw new Error("Could not upload files to IPFS");
    }
  }


}
  export default IPFSStorageNetwork;
