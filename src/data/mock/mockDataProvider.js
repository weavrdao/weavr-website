const faker = require("faker/locale/en")

export const proposals = [
  {
    id: "0x109b588a4f2a234e302c722f91fe42c5ab828a32",
    org: {
      title: "2214 N 7th St, Saint Joseph, MO 64505, United States"
    },
    createdBy: "0x220866b1a2219f40e72f5c628b65d54268ca3a9d",
    title: faker.commerce.productName(),
    description: faker.lorem.paragraphs(6),
    startTimestamp: 1626796800,
    endTimestamp: 1627228800,
    options: [
      {
        id: "0x04816db5c52241596376a07b0ed6306c8eef74ac7f9c3767ca11e2088c3a8f52",
        title: "Option A"
      },
      {
        id: "0x3d028447bfe1dcc2c859f717b9d62b86e956e0df786c46818f8bb8479ba4a710",
        title: "Option B"
      },
      {
        id: "0x0b0a497079ec1c7246ec20851a38df9f87eed1d94ffe497288f48166d01e7762",
        title: "Option C"
      }
    ]
  },
]

export const marketOffers = () => {
  var offers = []

  for (var i = 0; i < faker.datatype.number(10) + 2; i++) {
    let offer = {
      id: faker.datatype.hexaDecimal(40),
      world: {
        env: {
          currency: {
            code: "USD",
            symbol: "$",
            rate: {
              eth: 0.00046,
            },
          },
          measurements: {
            area: {
              system: "imperial",
              unit: "sqft",
            },
          }
        },
        property: {
          address: `${ faker.address.streetAddress(true) }, ${ faker.address.cityName() }, ${ faker.address.stateAbbr() }, ${ faker.address.zipCode() }, ${ faker.address.country() }`,
          currentRent: faker.datatype.number(8000) + 800,
          marketValue: faker.datatype.number(90000000) + 200000,
          area: faker.datatype.number(3000) + 1000,
          rooms: {
            bd: faker.datatype.number(6),
            ba: faker.datatype.number(6),
          },
          grossYieldPct: faker.datatype.number(12),
          yearBuilt: faker.datatype.number(20) + 1990,
          coverImageUrl: faker.image.imageUrl(),
        },
      },
      chain: {
        holderCount: faker.datatype.number(30000),
        erc20: {
          address: "0xfdf21d1cd5d3f0edbaed7cd1172ab3e49882d056",
          code: "FRBA-" + faker.datatype.hexaDecimal(40),
          marketCap: faker.datatype.number(90000000) + 200000,
          price: 0.00028,
        },
      },
    }

    offers.push(offer)
  }

  return offers
}

export const myAssets = () => {
  var assets = []

  for (var i = 0; i < faker.datatype.number(0) + 1; i++) {
    let asset = {
      id: faker.datatype.hexaDecimal(40),
      world: {
        env: {
          currency: {
            code: "USD",
            symbol: "$",
            rate: {
              eth: 0.00046,
            },
          },
          measurements: {
            area: {
              system: "imperial",
              unit: "sqft",
            },
          }
        },
        property: {
          address: `${ faker.address.streetAddress(true) }, ${ faker.address.cityName() }, ${ faker.address.stateAbbr() }, ${ faker.address.zipCode() }, ${ faker.address.country() }`,
          currentRent: faker.datatype.number(8000) + 800,
          marketValue: faker.datatype.number(90000000) + 200000,
          area: faker.datatype.number(3000) + 1000,
          rooms: {
            bd: faker.datatype.number(6),
            ba: faker.datatype.number(6),
          },
          grossYieldPct: faker.datatype.number(12),
          yearBuilt: faker.datatype.number(20) + 1990,
          coverImageUrl: faker.image.imageUrl(),
        },
      },
      chain: {
        holderCount: faker.datatype.number(30000),
        erc20: {
          address: "0xfdf21d1cd5d3f0edbaed7cd1172ab3e49882d056",
          code: "FRBA-" + faker.datatype.hexaDecimal(40),
          marketCap: faker.datatype.number(90000000) + 200000,
          price: 0.00028,
          balance: 44772.22,
        },
        dao: {
          proposals: [
            proposals[0],
          ],
          proposalsOpen: 1,
          votingStrengthFactor: 2,
        },
      },
    }

    assets.push(asset)
  }

  return assets
}