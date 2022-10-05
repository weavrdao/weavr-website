import TokenContract from "../../data/network/web3/contracts/tokenContract";
import gql from "graphql-tag";
import { CONTRACTS } from "../constants";

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
    console.log(CONTRACTS.WEAVR);
    const toke = CONTRACTS.WEAVR.toLowerCase()
    let tokenInfo = await this.graphQLAPIClient
    .query(
      TOKEN_INFO_QUERY, 
      {
        weav: toke,
      }, 
      (mapper, response) => { 
        console.log("TOKEN_INFO_TOKEN_SERVICE\n",response.data);
        return mapper.mapTokenInfo(response.data)
      
      }
    )
    console.log("TOIKEN_INFO___", tokenInfo);
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

