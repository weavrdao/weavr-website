// const { ethers, waffle, network } = require('hardhat')

// let signGlobal = [
//   {
//     name: 'Frabric Protocol',
//     version: '1',
//     chainId: 4,
//   },
//   {
//     Vouch: [{ type: 'address', name: 'participant' }],
//     KYCVerification: [
//       { type: 'uint8', name: 'participantType' },
//       { type: 'address', name: 'participant' },
//       { type: 'bytes32', name: 'kyc' },
//       { type: 'uint256', name: 'nonce' },
//     ],
//   },
// ]

// function sign(signer, data) {
//   let signArgs = JSON.parse(JSON.stringify(signGlobal))
//   if (Object.keys(data).length === 1) {
//     signArgs[1] = { Vouch: signArgs[1].Vouch }
//   } else {
//     signArgs[1] = { KYCVerification: signArgs[1].KYCVerification }
//   }

//   // Shim for the fact ethers.js will change this functions names in the future
//   if (signer.signTypedData) {
//     return signer.signTypedData(...signArgs, data)
//   } else {
//     return signer._signTypedData(...signArgs, data)
//   }
// }

// ;(async () => {
//   let frabric = await new ethers.Contract(
//     process.env.FRABRIC,
//     require('../artifacts/contracts/frabric/Frabric.sol/Frabric.json').abi,
//     (
//       await ethers.getSigners()
//     )[0]
//   )

//   await frabric.vouch(
//     '0x6Ac7F09FA05f40E229064fA20EF3D27c4c961591',
//     await sign(frabric.signer, {
//       participant: '0x6Ac7F09FA05f40E229064fA20EF3D27c4c961591',
//     })
//   )
// })()