/* eslint-disable max-lines-per-function */

import {Proposal} from "../../models/proposal";
import {VoteType} from "../../models/vote";
import {
  GraphQLAPIClient,
  ALL_ASSETS_QUERY,
  PARTICIPANTS_BY_TYPE,
  ALL_PROPOSALS,
  VOUCHES_PER_PARTICIPANT,
} from "../../data/network/graph/graphQLAPIClient";
import {CONTRACTS} from "../constants";
import AssetContract from "../../data/network/web3/contracts/assetContract";
import {ethers} from "ethers";
import {createToaster} from "@meforma/vue-toaster";

// TODO: Should there be a single service instance per proposal?

/**
 * DAO service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class DAO {
  constructor(ethereumClient, graphQLAPIClient, storageNetwork) {
    this.ethereumClient = ethereumClient;
    this.graphQLAPIClient = graphQLAPIClient;
    this.storageNetwork = storageNetwork;
  }

  /**
   * Get proposals that from this asset"s DAO.
   * @param {string} assetId Asset's contract address
   * @param {Storage} localStorage Local storage
   * @returns {Proposal[]} Array of proposals
   */
  // eslint-disable-next-line max-lines-per-function
  async getProposalsForAsset(assetId, localStorage) {
    // Get indexed on-chain data
    const toast = createToaster({});
    toast.info("Fetching off-chain data...");
    let proposals = await this.graphQLAPIClient.query(ALL_PROPOSALS, {id: assetId}, (mapper, response) => {
      return mapper.mapProposals(response.data.frabric);
    });

    // Fetch and append off-chain data
    try {
      const offChainData = await this.storageNetwork.getFiles(proposals.map((p) => p.info), localStorage);
      for (let i = 0; i < proposals.length; i++) {
        if (offChainData[i].value) {
          proposals[i].title = offChainData[i].value.title || "Untitled";
          proposals[i].description = offChainData[i].value.description || "No description";
          proposals[i].daoResolution = offChainData[i].value.daoResolution || false;
          proposals[i].forumLink = offChainData[i].value.forumLink || "https://forum.weavr.org";
        } else {
          proposals[i].title = "Untitled";
          proposals[i].description = "No description";
          proposals[i].daoResolution = false;
          proposals[i].forumLink = offChainData[i].forumLink || "https://forum.weavr.org";
        }
      }
      toast.clear();
    } catch (e) {
      console.log(e);
    }

    try {
      console.log("getting descriptors")
      const descriptorData = await this.storageNetwork.getFiles(proposals.map((proposal) => proposal.descriptor), localStorage);
      for (let i = 0; i < proposals.length; i++) {
        if (descriptorData[i] && descriptorData[i].value) {
          proposals[i].descriptor = descriptorData[i].value.descriptor || "Could not load descriptor";
        } else {
          proposals[i].descriptor = "Could not load descriptor";
        }
      }
    } catch (e) {
      console.log(e)
    }
    return proposals;
  }

  async getParticipantsByType(type) {
    const participants = await this.graphQLAPIClient.query(PARTICIPANTS_BY_TYPE, {
      type: type
    }, (mapper, response) => {
      return mapper.mapParticipantsByType(response.data.frabric);
    })

    console.log("PARTICIPANTS____", participants)
  }

  async getUserVouches(signer) {
    console.log("vouches");
    let vouches = await this.graphQLAPIClient.query(VOUCHES_PER_PARTICIPANT, {
      id: process.env.INITIALFRABRIC,
      signer: signer
    }, (mapper, response) => {
      return mapper.mapVouchers(response.data);
    });

    console.log(vouches);
    return vouches;
  }

  /**
   * Create a Paper Proposal
   * @param {String} assetId Asset's contract address
   * @param {String} name Chosen name for the thread
   * @param {String} descriptor of the thread
   * @param {String} title Proposal title
   * @param {String} description Proposal body
   * @param {String} forumLink Link to forum discussion
   * @param {String} tradeToken addess of the token used for the crowdfund
   * @param {Number} target amount to be raised through the crowdfund
   * @param {String} images of the property
   * @param {String} documents of the property
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createThreadProposal(
    assetId,
    blobVersion,
    name,
    descriptor,
    title,
    description,
    metrics,
    forumLink,
    symbol,
    tradeToken,
    target,
    images,
    documents,
  ) {
    const assetContract = new AssetContract(this.ethereumClient, assetId);

    let imagesHashes;
    try {
      imagesHashes = await Promise.all(Array.from(images).map(
        async (image) => (await this.storageNetwork.addArbitraryFile(image.name))
      ));
    } catch (e) {
      console.log("Error uploading images", e);
    }

    let documentHashes;
    try {
      documentHashes = await Promise.all(Array.from(documents).map(
        async (document) => (await this.storageNetwork.addArbitraryFile(document.name))
      ));
    } catch (e) {
      console.log("Error uploading documents", e);
    }
    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, description, forumLink,
    });

    const descriptorHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      blobVersion,
      descriptor, name, imagesHashes, documentHashes,
      metrics
    });

    const data = new ethers.utils.AbiCoder().encode(
      ["address", "uint112"],
      [tradeToken, ethers.utils.parseUnits(String(target), 6).toString()]
    );

    if (!infoHash) return;
    if (!descriptorHash) return;

    const status = await assetContract.proposeThread(
      ethers.BigNumber.from(0), // Only valid "variant" number
      name,
      symbol,
      descriptorHash,
      data,
      infoHash,
      {
        gasLimit: 300000
      }
    );
    return status;
  }

  /**
   * Create a Paper Proposal
   * @param {String} asset Asset's contract address
   * @param {string} title Proposal title
   * @param {string} description Proposal body
   * @param {string} forumLink Link to forum discussion
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createPaperProposal(asset, title, description, forumLink, daoResolution) {
    const assetContract = new AssetContract(this.ethereumClient, asset);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, description, forumLink, daoResolution,
    });
    if (!infoHash) return;

    const status = await assetContract.proposePaper(false, infoHash);
    return status;
  }

  /**
   * Create a Participant Proposal
   * @param assetId
   * @param {number} participantType Proposal title
   * @param {string} participant Address of the participant
   * @param {string} title Title of the proposal (may be autogenerated)
   * @param {string} description Proposal body
   * @param {string} forumLink Link to forum discussion
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createParticipantProposal(assetId, participantType, participant, title, description, forumLink) {

    const assetContract = new AssetContract(this.ethereumClient, assetId);
    console.log({
      title: title, description, forumLink
    })

    let infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title: title, description, forumLink
    });

    console.log("INFOHASH___", infoHash)

    if (!infoHash) return;

    let status = await assetContract.proposeParticipant(participantType, participant, infoHash);
    return status;
  }

  async createParticipantRemovalProposal(assetId, participant, removalFee, signatures, title, description, forumLink) {
    const assetContract = new AssetContract(this.ethereumClient, assetId);
    let infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title: title, description, forumLink
    });
    if (!infoHash) return;
    let status = await assetContract.proposeParticipantRemoval(participant, removalFee, signatures, infoHash);
    return status;
  }

  /**
   * Create an upgrade proposal
   * @param {String} assetAddress Asset's contract address
   * @param {String} beaconAddress Address of beacon handling upgrade
   * @param {Number} version Version number (simple increment)
   * @param {String} codeAddress Address of new contract
   * @param {String} upgradeData Data to be passed to newly upgraded contract
   * @param {String} title Proposal title
   * @param {String} description Proposal description
   * @returns {String} version Transaction status (true — mined; false - reverted)
   */
  // eslint-disable-next-line max-lines-per-function
  async createUpgradeProposal(assetAddress, beaconAddress, instanceAddress, codeAddress, title, description, forumLink, version, signer, governor) {
    if (!assetAddress || !beaconAddress || !instanceAddress || !codeAddress || !version || !signer || !governor) {
      console.log("Something wrong with the parameters at DAOservice level");

      return {
        assetAddress,
        beaconAddress,
        instanceAddress,
        codeAddress,
        title,
        description,
        forumLink,
        version,
        signer,
        governor,
      };
    } else {
      const DATA = ethers.utils.defaultAbiCoder.encode(["address", "address", "address", "address"], [CONTRACTS.BOND, CONTRACTS.THREAD_DEPLOYER, signer, governor]);
      const payload = {
        assetAddress: assetAddress,
        beaconAddress: beaconAddress,
        instanceAddress: instanceAddress,
        version: version,
        codeAddress: codeAddress,
      };
      console.log(payload);
      const assetContract = new AssetContract(this.ethereumClient, assetAddress);

      const ipfsPathBytes = await this.storageNetwork.uploadAndGetPathAsBytes({
        title, description, forumLink,
      });

      const status = await assetContract
        .proposeUpgrade(beaconAddress, instanceAddress, version, codeAddress, DATA, ipfsPathBytes)
        .then((x) => {
          console.log("RETURN", x);
        })
        .catch((err) => {
          console.log("ERR: => ", err.message);
        });

      return status;
    }
  }

  async createTokenActionProposal(assetId, tokenAddress, targetAddress, mint, price, amount, title, description, forumLink,) {
    const assetContract = new AssetContract(this.ethereumClient, assetId);

    const ipfsPathBytes = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, description, forumLink,
    });

    const status = await assetContract.proposeTokenAction(tokenAddress, targetAddress, mint, price, amount, ipfsPathBytes);

    return status;
  }

  async vouch(participant, signature) {
    const assetContract = new AssetContract(this.ethereumClient, CONTRACTS.WEAVR);
    console.log("DAO__", signature)
    const status = await assetContract.vouch(participant, signature);
    console.log(signature)
    return status;
  }

  async queue(proposalId) {
    const assetContract = new AssetContract(this.ethereumClient, CONTRACTS.WEAVR);
    console.log("DAO__", proposalId)
    const status = await assetContract.queueProposal(proposalId);

    return status;
  }

  async complete(proposalId, data) {
    const assetContract = new AssetContract(this.ethereumClient, CONTRACTS.WEAVR);
    console.log("DAO__", proposalId)
    const status = await assetContract.completeProposal(proposalId, data);

    return status;
  }


  /**
   *
   * @param {*} pType
   * @param {*} approving
   * @param {*} kycHash
   * @param {*} signature
   */
  async approve(pType, approving, kycHash, signature) {
    const assetContract = new AssetContract(this.ethereumClient, CONTRACTS.WEAVR);
    console.log("DAO____", {pType, approving, kycHash, signature})
    const status = await assetContract.approve(pType, approving, kycHash, signature);
    return status;
  }

  /**
   * Vote on a proposal
   * @param {Asset} asset Asset that the DAO controls
   * @param {Proposal} proposal Proposal to vote on
   * @param {VoteType} voteType Type of the vote
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async vote(assetAddress, proposalId, votes) {
    const assetContract = new AssetContract(this.ethereumClient, assetAddress);
    const status = await assetContract.vote(proposalId, votes);
    return status;
  }

  async withdraw(assetAddress, proposalId) {
    const assetContract = new AssetContract(this.ethereumClient, assetAddress);
    const status = await assetContract.withdrawProposal(proposalId);
    return status;
  }

  async quorum(assetAddress) {
    const assetContract = new AssetContract(
      this.ethereumClient,
      assetAddress
    );
    const quorum = await assetContract.requiredParticipation();
    return quorum;
  }

  async getTokenAddress(frabricAddress) {
    const assetContract = new AssetContract(this.ethereumClient, frabricAddress);

    const erc20Address = await assetContract.erc20();

    return erc20Address;
  }
}

export default DAO;
