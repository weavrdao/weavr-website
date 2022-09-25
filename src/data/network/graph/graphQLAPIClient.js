import {
  THREAD_PROPOSAL_QUERY,
  ALL_ASSETS_QUERY,
  PARTICIPANTS_PER_DAO,
  VOUCHES_PER_PARTICIPANT,
  ALL_PROPOSALS,
} from "./queries"

/**
 * Abstract GraphQL API client
 * @property {GraphQLAPIMapper} mapper Model mapper
 */
class GraphQLAPIClient {
  constructor(
    mapper
  ) {
    this.mapper = mapper
  }

  /**
   * @callback mappingCallback
   * @param {GraphQLAPIMapper} mapper
   * @param {any} response
   * @returns {any} Mapped data
   */

  /**
   * Query ¯\_(ツ)_/¯ 
   * @param {any} query Query doc
   * @param {Array} vars Query variables
   * @param {mappingCallback} mappingCallback Model mapping callback
   */
  async query(query, vars = {}, mappingCallback = {}) { }
}

export { 
  GraphQLAPIClient,
  ALL_ASSETS_QUERY,
  PARTICIPANTS_PER_DAO,
  VOUCHES_PER_PARTICIPANT,
  THREAD_PROPOSAL_QUERY,
  ALL_PROPOSALS,
}
