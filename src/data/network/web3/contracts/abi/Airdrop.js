const abi = [
  {
    "type": "constructor",
    "name": "",
    "stateMutability": "",
    "constant": false,
    "inputs": [
      {
        "type": "uint8",
        "name": "daysUntilExpiry",
        "simpleType": "uint"
      },
      {
        "type": "address",
        "name": "erc20",
        "simpleType": "address"
      },
      {
        "type": "address[]",
        "name": "claimants",
        "simpleType": "slice",
        "nestedType": {
          "type": "address"
        }
      },
      {
        "type": "uint256[]",
        "name": "amounts",
        "simpleType": "slice",
        "nestedType": {
          "type": "uint",
          "count": 256
        }
      }
    ],
    "id": "0x8683203b"
  },
  {
    "type": "function",
    "name": "_expiryDate",
    "stateMutability": "view",
    "constant": true,
    "outputs": [
      {
        "type": "uint64",
        "name": "",
        "simpleType": "uint"
      }
    ],
    "id": "0x2c78638b"
  },
  {
    "type": "function",
    "name": "_token",
    "stateMutability": "view",
    "constant": true,
    "outputs": [
      {
        "type": "address",
        "name": "",
        "simpleType": "address"
      }
    ],
    "id": "0xecd0c0c3"
  },
  {
    "type": "function",
    "name": "claim",
    "stateMutability": "nonpayable",
    "constant": false,
    "id": "0x4e71d92d"
  },
  {
    "type": "function",
    "name": "expire",
    "stateMutability": "nonpayable",
    "constant": false,
    "id": "0x79599f96"
  },
  {
    "type": "function",
    "name": "viewClaim",
    "stateMutability": "view",
    "constant": true,
    "inputs": [
      {
        "type": "address",
        "name": "claimant",
        "simpleType": "address"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "",
        "simpleType": "uint"
      }
    ],
    "id": "0xd0d359c5"
  },
  {
    "type": "event",
    "name": "BurnedTokens",
    "stateMutability": "",
    "constant": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "amount",
        "simpleType": "uint"
      }
    ],
    "id": "0x827adaebc9c47b3ef636b7836e0c06ccf1a746b9ceaf723363ab531fc55fa155"
  },
  {
    "type": "event",
    "name": "ClaimRedeemed",
    "stateMutability": "",
    "constant": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "amount",
        "simpleType": "uint"
      },
      {
        "type": "address",
        "name": "claimant",
        "simpleType": "address"
      }
    ],
    "id": "0xed34a9ff8cb3bd7c0f10aa5ffbdd31aed235e37d65cc4fdf42842f83842f7764"
  }
]

export default abi;