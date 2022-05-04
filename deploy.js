const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

//HDWalletProvider connects to a certain network and unlocks an account for use on the network
const provider = new HDWalletProvider(
    'seed phrase',
    'infura api key'
);

const web3 =  new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy contract from', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
   .deploy({ data: bytecode })
   .send({gas: '1000000', from: accounts[0]});

   console.log(interface);
   console.log('Contract deployed to', result.options.address);
}

deploy();
