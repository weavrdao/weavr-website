const axios = require("axios");

const netlify = ".netlify/functions/api"
const env = "prod"
export const getAccessToken = async (id) => {
  const ID = id.slice(2)
  const url = `https://api.weavr.org/${netlify}/${env}/${ID}`
  return axios({
    method: "get",
    headers: {},
    url: url
  });
}

export const callSimulateFunc = async (proposalId, assetId, networkId, queueTimestamp, completeTimestamp) => {
  const url = `https://api.weavr.org/${netlify}/simulate-proposal`
  const data = new FormData();
  data.append('proposalId', proposalId);
  data.append('assetId', assetId);
  data.append('queueTimestamp', queueTimestamp);
  data.append('completeTimestamp', completeTimestamp);
  data.append('networkId', networkId);
  return await axios.post(url, data, {headers: {'Content-Type': 'multipart/form-data'}})

}
