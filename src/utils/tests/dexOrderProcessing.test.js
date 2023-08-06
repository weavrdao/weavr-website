/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
import { chronologicalEventSort, OrderProcessor } from "../dexOrderProcessing";

describe("chronologicalEventSort", () => {
  it("should return a negative value when the first event is later than the second", () => {
    const e1 = { blockNumber: 2, transactionIndex: 1, logIndex: 1 };
    const e2 = { blockNumber: 1, transactionIndex: 1, logIndex: 1 };
    const result = chronologicalEventSort(e1, e2);
    expect(result).toBeLessThan(0);
  });

  it("should return a positive value when the first event is earlier than the second", () => {
    const e1 = { blockNumber: 1, transactionIndex: 1, logIndex: 1 };
    const e2 = { blockNumber: 2, transactionIndex: 1, logIndex: 1 };
    const result = chronologicalEventSort(e1, e2);
    expect(result).toBeGreaterThan(0);
  });

  it("should prioritize transaction index when block numbers are equal", () => {
    const e1 = { blockNumber: 1, transactionIndex: 2, logIndex: 1 };
    const e2 = { blockNumber: 1, transactionIndex: 1, logIndex: 1 };
    const result = chronologicalEventSort(e1, e2);
    expect(result).toBeLessThan(0);
  });

  it("should prioritize log index when block numbers and transaction indexes are equal", () => {
    const e1 = { blockNumber: 1, transactionIndex: 1, logIndex: 2 };
    const e2 = { blockNumber: 1, transactionIndex: 1, logIndex: 1 };
    const result = chronologicalEventSort(e1, e2);
    expect(result).toBeLessThan(0);
  });

  it("should throw an error when events are identical", () => {
    const e1 = { blockNumber: 1, transactionIndex: 1, logIndex: 1 };
    const e2 = { blockNumber: 1, transactionIndex: 1, logIndex: 1 };
    expect(() => chronologicalEventSort(e1, e2)).toThrow();
  });
});

describe.skip("OrderProcessor", () => {
  let orderProcessor;

  beforeEach(() => {
    orderProcessor = new OrderProcessor();
  });

  it("processes order increase correctly", () => {
    const rawOrderIncreaseEvent = ["trader1", "100", "10"];
    orderProcessor.processOrderIncrease(rawOrderIncreaseEvent);
    expect(orderProcessor.orders).toEqual({
      "100": [{ trader: "trader1", pricePoint: "100", amount: "10", currentIndex: 0 }]
    });
  });

  it("processes order fill correctly", () => {
    const rawOrderIncreaseEvent = ["trader1", "100", "10"];
    orderProcessor.processOrderIncrease(rawOrderIncreaseEvent);

    const rawOrderFillEvent = ["trader1", "100", "5"];
    orderProcessor.processOrderFill(rawOrderFillEvent);

    expect(orderProcessor.orders).toEqual({
      "100": [{ trader: "trader1", pricePoint: "100", amount: "5", currentIndex: 0 }]
    });
  });

  it("processes order cancellation correctly", () => {
    const rawOrderIncreaseEvent = ["trader1", "100", "10"];
    orderProcessor.processOrderIncrease(rawOrderIncreaseEvent);

    const rawOrderCancelEvent = ["trader1", "100"];
    orderProcessor.processOrderCancel(rawOrderCancelEvent);

    expect(orderProcessor.orders).toEqual({
      "100": []
    });
  });

  it("processes events correctly", () => {
    const events = [
      { name: "OrderIncrease", orderingIndicies: { blockNumber: 1, transactionIndex: 1, logIndex: 1 }, event: ["trader1", "100", "10"] },
      { name: "OrderFill", orderingIndicies: { blockNumber: 2, transactionIndex: 1, logIndex: 1 }, event: ["trader1", "100", "5"] },
      { name: "OrderIncrease", orderingIndicies: { blockNumber: 3, transactionIndex: 1, logIndex: 1 }, event: ["trader2", "100", "20"] },
      { name: "OrderCancellation", orderingIndicies: { blockNumber: 4, transactionIndex: 1, logIndex: 1 }, event: ["trader1", "100"] }
    ];

    const result = orderProcessor.processEvents(events);
    expect(result).toEqual({
      "100": [{ trader: "trader2", pricePoint: "100", amount: "20", currentIndex: 0 }]
    });
  });
});

