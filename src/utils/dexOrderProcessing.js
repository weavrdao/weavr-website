import { ethers } from "ethers";

const orderTypeMap = {
  0: "NULL",
  1: "BUY",
  2: "SELL",
};

const chronologicalEventSort = (e1, e2) => {
  const { blockNumber: bn1, transactionIndex: txi1, logIndex: li1 } = e1;
  const { blockNumber: bn2, transactionIndex: txi2, logIndex: li2 } = e2;

  // Events emitted in different blocks.
  const bnComparison = bn2 - bn1;
  if (bnComparison !== 0) return bnComparison;

  // Events emitted in same block, but seperate transactions.
  const txiComparison = txi2 - txi1;
  if (txiComparison !== 0) return txiComparison;

  // Events emitted in same transaction.  
  const liComparison = li2 - li1;
  if (liComparison !== 0) return liComparison;

  // Should never happen.
  throw new Error("Duplicate event passed to chronologicalEventSort, ensure that events are unique.");
}


class OrderProcessor {
  constructor(events) {
    // Mirrors on-chain structure
    this.orderBook = {};

    if (events && events.length > 0) {
      this.processEvents(events);
    }
  }

  updateOrders(events) {
    if (!events || events.length === 0) return;
    this.processEvents(events);
  }

  getOrders() {
    return Object.entries(this.orderBook).map(([price, orders]) => ({
      price,
      amount: orders.reduce((total, order) => total.add(order.amount), ethers.BigNumber.from(0)),
    }));
  }

  processOrderIncrease({ event }) {
    const [trader, pricePoint, amount] = event;
    const price = pricePoint.toString();

    if (!this.orderBook[price]) {
      this.orderBook[price] = [];
    }

    this.orderBook[price].push({ trader, pricePoint: price, amount, currentIndex: this.orderBook[price].length });
  }

  processOrderFill({ event }) {
    const [orderer, pricePoint, _, amount] = event;
    const price = pricePoint.toString();

    // Assumes only one order per user at a given price point.
    const orderIndex = this.orderBook[price].findIndex(order => order.trader === orderer);

    if (orderIndex !== -1) {
      if (this.orderBook[price][orderIndex].amount > amount) {
        this.orderBook[price][orderIndex].amount -= amount;
      } else {
        this.orderBook[price].splice(orderIndex, 1);
      }
    }

    this.orderBook[price] = this.orderBook[price].map((order, index) => ({...order, currentIndex: index}));

  }

  processOrderCancel({ event }) {
    const [trader, pricePoint] = event;
    const price = pricePoint.toString();

    const orderIndex = this.orderBook[price].findIndex(order => order.trader === trader);

    if (orderIndex !== -1) {
      this.orderBook[price].splice(orderIndex, 1);
    }

    this.orderBook[price] = this.orderBook[price].map((order, index) => ({...order, currentIndex: index}));
  }

  processEvents(events) {
    console.log(`Processing ${events.length} events.`);
    const chronologicalEvents = events.sort(
      ({ orderingIndicies: oi1 }, { orderingIndicies: oi2 }) => chronologicalEventSort(oi1, oi2)
    );

    console.log("chronologicalEvents");
    console.log(chronologicalEvents);

    for (const event of chronologicalEvents) {
      switch (event.name) {
      case "Order":
      case "OrderCancelling":
        // no-op
        break;
      case "OrderIncrease":
        this.processOrderIncrease(event);
        break;
      case "OrderFill":
        this.processOrderFill(event);
        break;
      case "OrderCancellation":
        this.processOrderCancel(event);
        break;
      default:
        console.error(`Unknown event type: ${event.name}`);
      }
    }

    console.log(this.orderBook);
    return this.orderBook;
  }
}

export { chronologicalEventSort, OrderProcessor };

