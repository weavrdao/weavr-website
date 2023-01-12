/* eslint-disable max-lines-per-function */
/* global BigInt */

import * as CommonUtils from "../../utils/common"
import PlatformContract from "../../data/network/web3/contracts/platformContract"
import AssetContract from "../../data/network/web3/contracts/assetContract"
import StorageNetwork from "../../data/network/storage/storageNetwork"
import Asset from "../../models/asset"
import { GraphQLAPIClient, ALL_ASSETS_QUERY, ALL_THREADS_QUERY, ALL_NEEDLES_QUERY } from "../../data/network/graph/graphQLAPIClient"
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient"
import { getIpfsHashFromBytes32 } from "../../data/network/storage/ipfs/common";
import { NETWORK } from "../constants"

/**
 * Market Provider service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class Market {
  constructor (
    ethereumClient,
    graphQLAPIClient,
    storageNetwork,
  ) {
    this.ethereumClient = ethereumClient
    this.graphQLAPIClient = graphQLAPIClient
    this.storageNetwork = storageNetwork
  }
  
  /**
   * Get assets that are currently trading on the market.
   * @param {number} limit
   * @param {number} offset
   * @param {Object} idsArray ids to return; everything is returned if null
   * @param {string} sort accepted format is [field_name]:[asc|desc]
   * @param {number} minBlockNumber The min block number
   * @returns {Object} {Array of asset objects}
   * @example
   * await getAssetsOnTheMarket()
   * await getAssetsOnTheMarket(100, 0, [1,2,3,4,5])
   */
  async getAssetsOnTheMarket(
    limit = 100, 
    offset = 0, 
    idsArray = null, 
    sort = null, 
    minBlockNumber = null
  ) {
    // Get indexed on-chain data

    var assets = await this.graphQLAPIClient
      .query(
        ALL_THREADS_QUERY, 
        {
          weavrId: NETWORK.contracts.WEAVR
        }, 
        (mapper, response) => { return mapper.mapThreads(response.data) }
      )

    console.log("Mapped assets:")
    console.log(assets)

    // TODO: CONSIDER DISCONTINUED/DEACTIVATED ASSETS

    // Fetch and append off-chain data

    const assetDataURIArray = assets
      .map(asset => asset.dataURI)
    let assetOffchainDataArray = (
      await this.storageNetwork
        .getFiles(assetDataURIArray.map(uri => CommonUtils.pathFromURL(uri)))
    )
      .map(obj => obj.world.property)

    console.log("Off-chain data:")
    console.log(assetOffchainDataArray)

    if (assetOffchainDataArray.length != assets.length) {
      throw("Off-chain data count doesn't match the on-chain data")
    }

    for (var i = 0; i < assets.length; i++) {
      let asset = assets[i]
      let data = assetOffchainDataArray[i]

      let completeAsset = new Asset(
        asset.id,
        asset.dataURI,
        asset.contractAddress,
        asset.symbol,
        asset.numOfShares,
        asset.owners,
        asset.marketOrders,
        asset.proposals,
        data.address,
        data.area,
        data.coverImage,
        data.currentRent,
        data.description,
        data.grossYieldPct,
        data.marketValue,
        data.rooms.bdCount,
        data.rooms.baCount,
        data.yearBuilt
      )

      assets[i] = completeAsset
    }

    return assets
  }


  async getThreads(
    limit = 100, 
    offset = 0, 
    idsArray = null, 
    sort = null, 
    minBlockNumber = null
  ) {
    // Get indexed on-chain data

    const threads = await this.graphQLAPIClient
      .query(
        ALL_THREADS_QUERY, 
        {
          weavrId: NETWORK.contracts.WEAVR
        }, 
        (mapper, response) => { 
          console.log(response.data.threads)
          const mappedThreads =  mapper.mapRawThreads(response.data.threads) 
          console.log(mappedThreads)
          return mappedThreads
        }
      )

    console.log("Mapped assets:")
    console.log(threads)

    // TODO: CONSIDER DISCONTINUED/DEACTIVATED ASSETS

    // Fetch and append off-chain data
    try {
      
      const descriptors = threads.map(( thread ) => {
        console.log(thread.descriptor);
        return getIpfsHashFromBytes32(thread.descriptor)
      })
      console.log(descriptors);
      const offChainData = await this.storageNetwork.getFiles(
        descriptors
      );
      
      for(let i=0; i < threads.length; i++) {
        console.log(offChainData[i].value.descriptor)
        if(offChainData[i].value) {
          threads[i].descriptor = offChainData[i].value.descriptor;
          threads[i].name = offChainData[i].value.name;
          threads[i].imagesHashes = offChainData[i].value.imagesHashes;
          threads[i].documentHashes = offChainData[i].value.documentHashes;
        } else {
          threads[i].descriptor = offChainData[i].descriptor;
          threads[i].name = offChainData[i].name;
          threads[i].imagesHashes = offChainData[i].imagesHashes;
          threads[i].documentHashes = offChainData[i].documentHashes;
        }
      }
    } catch(e) {
      // no-op
      console.log(e);
    }

    // const assetDataURIArray = assets
    //   .map(asset => asset.descriptor)
    // let assetOffchainDataArray = (
    //   await this.storageNetwork
    //     .getFiles(assetDataURIArray.map(uri => CommonUtils.pathFromURL(uri)))
    // )
    //   .map(obj => obj.world.property)

    // console.log("Off-chain data:")
    // console.log(assetOffchainDataArray)

    // if (assetOffchainDataArray.length != assets.length) {
    //   throw("Off-chain data count doesn't match the on-chain data")
    // }

    // for (var i = 0; i < assets.length; i++) {
    //   let asset = assets[i]
    //   let data = assetOffchainDataArray[i]

    //   let completeAsset = new Asset(
    //     asset.id,
    //     asset.dataURI,
    //     asset.contractAddress,
    //     asset.symbol,
    //     asset.numOfShares,
    //     asset.owners,
    //     asset.marketOrders,
    //     asset.proposals,
    //     data.address,
    //     data.area,
    //     data.coverImage,
    //     data.currentRent,
    //     data.description,
    //     data.grossYieldPct,
    //     data.marketValue,
    //     data.rooms.bdCount,
    //     data.rooms.baCount,
    //     data.yearBuilt
    //   )

    //   assets[i] = completeAsset
    // }
    console.log("FINAL THREADS: ", threads);
    return threads
  }

  async getNeedles() {
    const needles = await this.graphQLAPIClient
      .query(
        ALL_NEEDLES_QUERY, 
        {
          weavrId: NETWORK.contracts.WEAVR
        }, 
        (mapper, response) => { 
          const mappedNeedles =  mapper.mapRawNeedles(response.data.crowdfunds) 
          return mappedNeedles
        }
      )
      console.log(needles)

    try {
      const offChainData = await this.storageNetwork.getFiles(
        needles.map(({ thread }) => getIpfsHashFromBytes32(thread.descriptor))
      );
      for(let i=0; i < needles.length; i++) {
        if(offChainData[i].value) {
          needles[i].descriptor = offChainData[i].value.descriptor;
          needles[i].name = offChainData[i].value.name;
          needles[i].imagesHashes = offChainData[i].value.imagesHashes;
          needles[i].documentHashes = offChainData[i].value.documentHashes;
        } else {
          needles[i].descriptor = offChainData[i].descriptor;
          needles[i].name = offChainData[i].name;
          needles[i].imagesHashes = offChainData[i].imagesHashes;
          needles[i].documentHashes = offChainData[i].documentHashes;
        }
      }
    } catch(e) {
      // no-op
    }

    return needles;
  }

  /**
   * Post a buy order on the market
   * @param {Asset} asset Asset to post an order for
   * @param {number} amount Amount of shares to buy
   * @param {BigInt} price Price level of the order
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async buy(
    asset,
    amount,
    price
  ) {
    const assetContract = new AssetContract(this.ethereumClient, asset.contractAddress)
    let status = await assetContract.buy(amount, price)

    return status
  }
}

export default Market
