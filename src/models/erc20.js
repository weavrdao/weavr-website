
class Erc20 {
  constructor(
    address,
    name,
    symbol,
    decimals,
    supply,
    tradeToken,
    balances
  ) {
    this.address = address
    this.name = name
    this.symbol = symbol
    this.decimals = decimals
    this.supply = supply
    this.tradeToken = tradeToken
    this.balances = balances
  }
}



export default Erc20