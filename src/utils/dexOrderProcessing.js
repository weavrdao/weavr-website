import { ethers } from "ethers";

const orderTypeMap = {
  0: "NULL",
  1: "BUY",
  2: "SELL",
};

const processRawOrderEvent = (rawOrderEvent) => {
  const orderType = rawOrderEvent[0];
  const pricePoint = rawOrderEvent[1];


  return {
    orderType: orderTypeMap[orderType],
    price: pricePoint,
  }
};

const processRawOrderIncreaseEvent = (rawOrderIncreaseEvent) => {
  const trader = rawOrderIncreaseEvent[0];
  const pricePoint = rawOrderIncreaseEvent[1];
  const amount = rawOrderIncreaseEvent[2];

  return {
    trader,
    price: pricePoint,
    amount,
  }
};

const processOrderFillEvent = (rawOrderFillEvent) => {
  const orderer = rawOrderFillEvent[0];
  const price = rawOrderFillEvent[1];
  const executor = rawOrderFillEvent[2];
  const amount = rawOrderFillEvent[3];
        
  return {
    orderer,
    price,
    executor,
    amount,
  }
};

const processOrderCancelEvent = (rawOrderCancelEvent) => {
  const trader = rawOrderCancelEvent[0];
  const price = rawOrderCancelEvent[1];
  const amount = rawOrderCancelEvent[2];

  return {
    trader,
    price,
    amount,
  }
};


const processAllRawOrderEvents = (rawEvents, userAddress) => {
  const rawOrderEvents = rawEvents.Order || [];
  const rawOrderIncreaseEvents = rawEvents.OrderIncrease || [];
  const rawOrderFillEvents = rawEvents.OrderFill || [];
  const rawOrderCancelEvents = rawEvents.OrderCancellation || [];

  const orders = rawOrderEvents.map(processRawOrderEvent);
  const orderIncreases = rawOrderIncreaseEvents.map(processRawOrderIncreaseEvent);
  const orderFills = rawOrderFillEvents.map(processOrderFillEvent);
  const orderCancels = rawOrderCancelEvents.map(processOrderCancelEvent);

  let orderBook = {};
  
  for(const order of orders) {
    const { orderType, price } = order;
    // Overwrite previous values ??
    orderBook[price.toString()] = { orderType, amount: ethers.BigNumber.from(0) };
  }

  for(const orderIncrease of orderIncreases) {
    const { trader, price, amount } = orderIncrease;

    orderBook[price.toString()].amount = orderBook[price.toString()].amount.add(amount);
  }

  for(const orderFill of orderFills) {
    const { orderer, price, executor, amount } = orderFill;

    orderBook[price.toString()].amount = orderBook[price.toString()].amount.sub(amount);
  }

  for(const orderCancel of orderCancels) {
    const { trader, price, amount } = orderCancel;
    orderBook[price.toString()].amount = orderBook[price.toString()].amount.sub(amount);
  }

  return Object.entries(orderBook).map(([price, order]) => ({ ...order, price }));
};

export { processAllRawOrderEvents };

