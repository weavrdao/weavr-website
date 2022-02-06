import { pick } from "lodash"

const assetDataSchema = {
  world: {
      property: {
          address: null,
          currentRent: 0,
          marketValue: 0,
          area: 0,
          rooms: {
              bdCount: 0,
              baCount: 0
          },
          grossYieldPct: 0,
          yearBuilt: 0,
          coverImage: null,
          description: null,
          doc: null
      }
  }
}

const proposalDataSchema = {
  title: null,
  description: null
}

export const newAssetData = (fields, validate = false) => {
  const validFields = validate
    ? pick(fields, Object.keys(assetDataSchema))
    : fields
  
  return {
    ...assetDataSchema,
    ...validFields
  }
}

export const newProposalData = (fields, validate = false) => {
  const validFields = validate
    ? pick(fields, Object.keys(proposalDataSchema))
    : fields
  
  return {
    ...proposalDataSchema,
    ...validFields
  }
}