import {
  ApolloClient,
  InMemoryCache
} from "@apollo/client/core"
import { NETWORK } from "../../../../services/constants"
import { GraphQLAPIClient } from "../graphQLAPIClient"

const client = new ApolloClient({
  uri: NETWORK.graph,
  // uri: "https://api.thegraph.com/subgraphs/name/0xnshuman/frabric-goerli",
  cache: new InMemoryCache()
})

class TheGraphAPIClient extends GraphQLAPIClient {
  constructor(
    mapper
  ) {
    super(mapper)
    this.client = client
  }

  async query(query, vars = {}, mappingCallback) {
    return new Promise((resolve) => {
      this.client
        .query({
          query: query,
          variables: vars,
          fetchPolicy: "no-cache"
        })
        .then(response => {
          console.log("Query result:")
          console.log(response)
          if(response) {
            resolve(mappingCallback(this.mapper, response))
          }
          
        })
        .catch(err => {
          // TODO: Propagate error
          console.log("Error fetching data: ", err)
        })
    })
  }
}

export default TheGraphAPIClient
