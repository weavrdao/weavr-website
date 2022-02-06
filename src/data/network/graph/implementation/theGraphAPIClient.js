import {
  ApolloClient,
  InMemoryCache
} from "@apollo/client/core"
import { GraphQLAPIClient } from "../graphQLAPIClient"

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/0xnshuman/frabric-subgraph-rinkeby-v2",
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
        resolve(mappingCallback(this.mapper, response))
      })
      .catch(err => { 
        // TODO: Propagate error
        console.log("Error fetching data: ", err) 
      })
    })
  }
}

export default TheGraphAPIClient
