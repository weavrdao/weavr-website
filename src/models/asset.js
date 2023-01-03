/**
 * Asset model.
 * @property {string} id ID of the asset
 * @property {string} dataURI Location of the off-chain data of the asset
 * @property {string} contractAddress Address of the asset contract
 * @property {string} symbol ERC-20 Symbol of the asset
 * @property {number} numOfShares Total supply of the asset shares
 * @property {Map<string, number>} owners The amount of shares held by all the owners
 * @property {MarketOrder[]} marketOrders The most recent state of the asset's order book
 * @property {Proposal[]} proposals Proposals made in the asset's DAO
 * @property {string} address Address of the property
 * @property {number} area Area of the property
 * @property {string} coverPictureURI Location of the cover picture data
 * @property {number} currentRent Current rent the property is making
 * @property {string} description Free-format desctiption attached to the property
 * @property {number} grossYieldPct Gross yield % of the property
 * @property {number} marketValue Market value of the property
 * @property {number} bedroomCount Number of bedrooms in the property
 * @property {number} bathroomCount Number of bathrooms in the property  
 * @property {number} yearBuilt The year property was built
 */
class Asset {
  constructor(
    id,
    dataURI,
    contractAddress,
    symbol,
    numOfShares,
    owners,
    marketOrders,
    proposals,
    address = null,
    area = null,
    coverPictureURI = null,
    currentRent = null,
    description = null,
    grossYieldPct = null,
    marketValue = null,
    bedroomCount = null,
    bathroomCount = null,
    yearBuilt = null
  ) {
    this.id = id
    this.dataURI = dataURI
    this.contractAddress = contractAddress
    this.symbol = symbol
    this.numOfShares = numOfShares
    this.owners = owners
    this.marketOrders = marketOrders
    this.proposals = proposals
    this.address = address
    this.area = area
    this.coverPictureURI = coverPictureURI
    this.currentRent = currentRent
    this.description = description
    this.grossYieldPct = grossYieldPct
    this.marketValue = marketValue
    this.bedroomCount = bedroomCount
    this.bathroomCount = bathroomCount
    this.yearBuilt = yearBuilt
  }
}

export default Asset