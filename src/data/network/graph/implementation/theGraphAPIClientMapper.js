/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */
import GraphQLAPIMapper from "../graphQLAPIMapper";
import { mapPaperProposals } from "./proposals";

class TheGraphAPIMapper extends GraphQLAPIMapper {
  // TODO(bill): This was invalid with the data model and needs to be rewritten
  mapAssets(rawAssets) {
    console.log(rawAssets);
  }

  // Map all proposal types to a single array to be written to global state
  mapProposals(rawProposals) {
    console.log(rawProposals);
    if (!rawProposals || rawProposals.length < 1) return [];

    return [...mapPaperProposals(rawProposals.paperProposals)];
  }
}

export default TheGraphAPIMapper;
