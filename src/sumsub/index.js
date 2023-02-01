const axios = require('axios');

const headers = { 
}
const netlify = ".netlify/functions/api"
const env = "dev"
export const getAccessToken = async (id) => {
  const ID = id.slice(2)
  const url = `https://api.weavr.org/${netlify}/${env}/${ID}`
  return await axios({
    method: "get",
    headers: headers,
    url: url
  })
}

// https://api.weavr.org:9000/.netlify/functions/api/dev/404A9Ab87f0C51245FAc908cdcDa9f67F08Df980
// https://api.weavr.org/.netlify/functions/api/dev/dasdsada