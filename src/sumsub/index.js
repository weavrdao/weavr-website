const axios = require("axios");

const headers = { 
}
const netlify = ".netlify/functions/api"
const env = "prod"
export const getAccessToken = async (id) => {
  const ID = id.slice(2)
  const url = `https://api.weavr.org/${netlify}/${env}/${ID}`
  return await axios({
    method: "get",
    headers: headers,
    url: url
  })
}
