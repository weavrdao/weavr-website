/* eslint-disable max-lines-per-function */

// import {Proposal} from "@/models/proposals/proposal";
// import {VoteType} from "../../models/vote"; 

import {CONTRACTS, NETWORK} from "../constants";
import AssetContract from "../../data/network/web3/contracts/assetContract";
import { callSimulateFunc} from "@/proxy"
import {ethers} from "ethers";
import {createToaster} from "@meforma/vue-toaster";
import InfuraEventCacheClient from "@/data/network/web3/events/InfuraEventCacheClient";


/**
 * DAO service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class DAO {
  constructor(ethereumClient, storageNetwork) {
    this.ethereumClient = ethereumClient;
    this.storageNetwork = storageNetwork;
    this.cacheClient = new InfuraEventCacheClient(NETWORK.id, process.env.VUE_APP_INFURA_API_KEY, NETWORK.startBlock)
  }

  /**
   * Get proposals that from this asset"s DAO.
   * @param { string } assetId Asset's contract address
   * @param { Storage } localStorage Local storage
   * @returns { Proposal[] } Array of proposals
   */
  async getProposalsForAsset(assetId, isThread, localStorage) {
  
    const toast = createToaster({});
    toast.info("Fetching off-chain data...");
    let proposals = await this.cacheClient.syncProposals(assetId, isThread)
  
    try {
      console.log("STORAGE NETWORK::", this.storageNetwork);
      const offChainData = await this.storageNetwork.getFiles(proposals.map((p) => p.info), localStorage);
      for (let i = 0; i < proposals.length; i++) {
        if (offChainData[i].value) {
          proposals[i].title = offChainData[i].value.title || "Untitled";
          proposals[i].description = offChainData[i].value.description || "See Forum Link for Details";
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
      console.log("PROPOSALS::::", proposals)
    } catch (e) {
      console.log(e);
    }

    try {
      console.log("getting descriptors")
      const threadProposalsMap = new Map();
      proposals.forEach( (proposal) => {
        if(proposal.descriptor) {
          threadProposalsMap.set(proposal.id, proposal.descriptor)
        }
      })
      console.log(threadProposalsMap.values());
      const descriptorData = await this.storageNetwork.getFiles(Array.from(threadProposalsMap.values()), localStorage)
      const indexes = Array.from(threadProposalsMap.keys())
      indexes.length != descriptorData.length ? console.log("Something wrong") : null

      console.log(descriptorData);
      descriptorData.forEach( (descriptor, i) => {
        if (descriptor && descriptor.value) {
          proposals[indexes[i]].descriptor = descriptor.value || "Could not load descriptor";
        } else {
          proposals[indexes[i]].descriptor = "Could not load descriptor";
        }
      })
        
      
    } catch (e) {
      console.log(e)
    }
    console.log("Proposals", proposals);
    return proposals;
  }

  async simulateWillProposalComplete(proposalId, timeToQueueTimestamp) {
    const assetId = CONTRACTS.WEAVR;
    const networkId  =  NETWORK.id;
    const toast = createToaster({});
    const timeToCompleteTimestamp = timeToQueueTimestamp + 60 * 60 * 24 * 2;
    const blockNumber = await this.cacheClient.provider.getBlockNumber()

    toast.info("Simulating Transaction Stack...");
    console.log("simluation start, payload: ", proposalId, assetId, networkId, blockNumber, timeToQueueTimestamp, timeToCompleteTimestamp)
    const response = await callSimulateFunc(proposalId, assetId, networkId, blockNumber, timeToQueueTimestamp, timeToCompleteTimestamp);
    let result = []
    console.log(response)
    for(let i = 0; i < response.data.simulation_results.length; i++) {
      const simulation = response.data.simulation_results[i].simulation
      if("error_message" in simulation) {
        result.push({status: "fail", url: `https://dashboard.tenderly.co/zeryx/project/simulator/${simulation.id}`})
      } else {
        result.push({status: "success", url: `https://dashboard.tenderly.co/zeryx/project/simulator/${simulation.id}`})
      }
    }
    console.log(result)
    toast.clear();
    return result
  }


  async getUserVouches(signer) {
    console.log("vouches");
    // let vouches = await this.graphQLAPIClient.query(VOUCHES_PER_PARTICIPANT, {
    //   id: process.env.INITIALFRABRIC,
    //   signer: signer
    // }, (mapper, response) => {
    //   return mapper.mapVouchers(response.data);
    // });

    // console.log(vouches);
    // return vouches;
  }

  /**
   * Create a Thread Proposal
   * Create a Thread Proposal
   * @param {String} title Proposal title
   * @param {String} description Proposal body
   * @param {String} assetId Asset's contract address
   * @param {String} name Chosen name for the thread
   * @param {String} descriptor of the thread
   * @param {string} blobVersion Version of the blob
   * @param {String} forumLink Link to forum discussion
   * @param {String} tradeToken addess of the token used for the crowdfund
   * @param {Number} funding_target amount to be raised through the crowdfund
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
    funding_target,
    images,
    documents,
  ) {
    const assetContract = new AssetContract(this.ethereumClient, assetId);

    let imageHashes;
    try {
      imageHashes = await Promise.all(Array.from(images).map(
        async (image) => (await this.storageNetwork.addArbitraryFile(image))
      ));
    } catch (e) {
      console.log("Error uploading images", e);
    }

    let documentHashes;
    try {
      documentHashes = await Promise.all(Array.from(documents).map(
        async (document) => (await this.storageNetwork.addArbitraryFile(document))
      ));
    } catch (e) {
      console.log("Error uploading documents", e);
    }
    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, description, forumLink,
    });

    const descriptorHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      blobVersion,
      descriptor, name, imagesHashes: imageHashes, documentHashes,
      metrics
    });
    console.log(">>>>>>>>>>>>", funding_target);
    const data = new ethers.utils.AbiCoder().encode(
      ["address", "uint112"],
      [tradeToken, funding_target]
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
    console.log("ASSET::", asset);
    const assetContract = new AssetContract(this.ethereumClient, asset);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, description, forumLink, daoResolution,
    });
    if (!infoHash) return;

    const status = await assetContract.proposePaper(false, infoHash);
    return status;
  }

  /**
   * Create a Dissolution Proposal
   * @param {String} asset Asset's contract address
   * @param {string} title Proposal title
   * @param {string} description Proposal body
   * @param {string} forumLink Link to forum discussion
   * @param {string} daoResolution Link to forum discussion
   * @param {string} token Address of the token
   * @param {string} purchaseAmount Amount of tokens to be purchased
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createDissolutionProposal(asset, title, description, forumLink, daoResolution, token, purchaseAmount) {
    console.log("ASSET::", asset);
    const assetContract = new AssetContract(this.ethereumClient, asset);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, description, forumLink, daoResolution,
    });
    if (!infoHash) return;

    const status = await assetContract.proposeDissolution(token, purchaseAmount, infoHash);
    return status;
  }

  /**
   * Create a DescriptorChange Proposal
   * @param {String} asset Asset's contract address
   * @param {string} title Proposal title
   * @param {string} description Proposal body
   * @param {string} forumLink Link to forum discussion
   * @param {string} descriptor New thread descriptor 
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createDescriptorChangeProposal(asset, title, description, forumLink, blobVersion, documents, images, metrics, descriptor) {
    console.log("ASSET::", asset);
    const assetContract = new AssetContract(this.ethereumClient, asset);
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

    const status = await assetContract.proposeDescriptorChange(descriptorHash, infoHash);
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
  async createParticipantProposal(assetId, title, participantType, participant, description, forumLink) {

    const assetContract = new AssetContract(this.ethereumClient, assetId);
    console.log({
      title, description, forumLink
    })

    let infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title, forumLink
    });

    console.log("INFOHASH___", infoHash)
    console.log(assetId, participant, participantType);
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
