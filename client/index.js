const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// Using yargs to parse out cmd arguments
const args = yargs(hideBin(process.argv))
    .option('name', {
        alias: 'n',
        type: 'string',
        description: 'Name to check if on gift list',
        demandOption: true
    })
    .parse()


const name = args.name
const serverUrl = 'http://localhost:1225';

async function main() {
  // Generate a merkle tree with the nice list 
  const merkleTree = new MerkleTree(niceList);
  const index = niceList.findIndex(n => n === name)

  // Generate a merkle proof to send to the server
  const proof = merkleTree.getProof(index)

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name: name,
    proof: proof
  });

  console.log({ gift });
}

main();