import TokenContract from "../../data/network/web3/contracts/tokenContract";
import gql from "graphql-tag";

const TOKEN_INFO_QUERY = gql`
  query WeavTokenInfo($weav: String!){
    frabric(id: $weav) {
      token{
        id
        name
        symbol
        decimals
        supply
        tradeToken
      }
    }
  }
`;

function awaitOn(promise) {
  Promise.all([promise]).then(
    () => {
      return promise;
    }
  )
}

export default class Token {
  constructor(
    ethereumClient,
    graphQLAPIClient
  ) {
    this.ethereumClient = ethereumClient;
    this.graphQLAPIClient = graphQLAPIClient
  }

  async getTokenInfo() {
    var tokenInfo = await this.graphQLAPIClient
    .query(
      TOKEN_INFO_QUERY, 
      {
        weav: process.env.VUE_APP_WEAVR_ADDRESS,
      }, 
      (mapper, response) => { 
        console.log("TOKEN_INFO_TOKEN_SERVICE\n",response.data.frabric.token);
        return mapper.mapTokenInfo(response.data)
      
      }
    )

    return tokenInfo
  }
  async getTokenBalance(tokenAddress, userAddress) {
    console.log([tokenAddress, userAddress])
    const tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const balance = await tokenContract.getBalance(userAddress);
    console.log(balance)
    return balance
  }
}

