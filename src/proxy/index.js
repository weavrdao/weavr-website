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

export const callSimulateFunc = async (proposalId, assetId, queueTimestamp, completeTimestamp) => {
  const url = `https://api.weavr.org/${netlify}/simulate-proposal`
  const data = {
    proposalId: proposalId,
    assetId: assetId,
    queueTimestamp: queueTimestamp,
    completeTimestamp: completeTimestamp
  }
  return axios ({
    method: "post",
    url: url,
    data: data
  })
}
