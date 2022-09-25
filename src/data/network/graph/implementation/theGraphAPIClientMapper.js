/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */
import GraphQLAPIMapper from "../graphQLAPIMapper";
import { MarketOrder } from "../../../../models/marketOrder";
import {
  mapPaperProposals,
  mapUpgradeProposals,
  mapParticipantProposals,
  mapTokenActionProposals,
} from "./proposals";
import { formatUnitsAsBigNumbers } from "../../../helpers/numbers";

class TheGraphAPIMapper extends GraphQLAPIMapper {
  // TODO(bill): This was invalid with the data model and needs to be rewritten
  mapAssets(rawAssets) {
    console.log(rawAssets);
  }

  mapRawMarketOrders(rawOrders) {
    if (!rawOrders || !rawOrders.data) return [];

    const orders = rawOrders.data.frabrics[0].token.orderBook; // TODO(bill): Add full path here
    console.log(orders);

    // Questionable way of getting test data but will do for now
    return this.mapMarketOrders(orders);
  }

  mapMarketOrders(rawMarketOrders) {
    if (!rawMarketOrders || rawMarketOrders.length < 1) {
      return [];
    }

    console.log(rawMarketOrders);

    return rawMarketOrders.map((rawMarketOrder) => {
      return new MarketOrder(
        rawMarketOrder.id,
        rawMarketOrder.type,
        rawMarketOrder.price,
        rawMarketOrder.totalAmount,
      );
    });
  }

  // Map all proposal types to a single array to be written to global state
  mapProposals(rawProposals) {
    console.log(rawProposals);
    if (!rawProposals || rawProposals.length < 1) return [];

    return [
      ...mapPaperProposals(rawProposals.paperProposals),
      ...mapUpgradeProposals(rawProposals.upgradeProposals),
      ...mapParticipantProposals(rawProposals.participantProposals),
      ...mapTokenActionProposals(rawProposals.tokenActionProposals),
    ];
  }
}

export default TheGraphAPIMapper;
