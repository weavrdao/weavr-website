/* global BigInt */

/**
 * MarketOrder model. Aggregates multiple orders at the same price level.
 * @property {string} id ID of the order
 * @property {MarketOrderType} orderType Type of the order (e.g. Buy or Sell)
 * @property {BigInt} price Price stored as BigInt
 * @property {number} amount Amount of tokens in the aggregated order
 */
 class MarketOrder {
  constructor(
    id,
    orderType,
    priceString,
    amount
  ) {
    this.id = id
    this.orderType = orderType
    this.price = BigInt(priceString)
    this.amount = amount
  }
}

const MarketOrderType = {
  Buy: "Buy",
  Sell: "Sell"
}

export { MarketOrder, MarketOrderType }