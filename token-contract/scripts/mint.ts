import { ethers } from 'ethers';
import FilterConnectTokenABI from '../artifacts/contracts/FilterConnectToken.sol/FilterConnectToken.json';
import { network } from 'hardhat';

async function main() {
  const apiKey = '6DaGf7XinMLS-1gly3rWdFv_4VxvFptP';
  // const providerUrl = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
  // const provider = new ethers.providers.AlchemyProvider('maticmum', apiKey);

  // const provider = new ethers.providers.AlchemyProvider('arbitrum-goerli', apiKey);

  const provider = new ethers.providers.AlchemyProvider('arbitrum', apiKey);

  const privateKey = process.env.BLACKBIRD_PRIVATE_KEY || '';
  const wallet = new ethers.Wallet(privateKey, provider);

  // Replace with the deployed contract address and its ABI
  const contractAddress = '0x9f0F659742642Df9a6dF3712214e9D1564666d5D';
  const contractABI = FilterConnectTokenABI.abi

  // Connect to the contract with the signer
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Replace with the desired token URI and recipient address
  const tokenURI = '0.json';

  // Mint the token and wait for the transaction to be confirmed
  const tx = await contract.safeMint(wallet.address, tokenURI);
  await tx.wait();

  console.log('Token minted successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
