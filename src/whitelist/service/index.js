import DaoContract from "../contracts/daoContract";
import WhitelistInterface from "../contracts/whitelistContract";
import gql from "graphql-tag";
import { CONTRACTS } from "../../services/constants";


const WHITELIST_QUERY = gql`
  query Whitelist($weav: String!) {
    frabric(id: $weav){  
      token {
        whitelist {
          person
          kycHash
        }
      }
      participants {
        id
        address
        type
      }
    }
  }
`;

class Whitelist {
  constructor(
    ethereumClient,
    graphApiClient
  ) {
    this.client = ethereumClient;
    this.graphQLAPIClient = graphApiClient
  }

  async checkWhitelistedStatus(userAddress) {
    // const daoContract = new DaoContract(this.client, weavrAddress);
    // const erc20Address = await daoContract.getERC20Address();
    // const whitelistContract = new WhitelistInterface(this.client, erc20Address);
    const toke = CONTRACTS.WEAVR.toLowerCase()
    let whitelist = await this.graphQLAPIClient
      .query(
        WHITELIST_QUERY, 
        {
          weav: toke,
        }, 
        (mapper, response) => { 
          console.log("WHITELIST_SERVICE___",response.data);
          return mapper.mapWeavrWhitelist(response.data)
        
        }
      )
      console.log("WHITELIST: ",whitelist);
      // console.log();
      console.log(whitelist.includes(userAddress.toLowerCase()))

    const isWhitelisted = whitelist.includes(userAddress.toLowerCase())

        
    return isWhitelisted;
  }
}

export default Whitelist;