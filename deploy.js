const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

//HDWalletProvider connects to a certain network and unlocks an account for use on the network
const provider = new HDWalletProvider(
    'effort project flush chaos firm aim weekend quote south toss dash lava',
    'https://kovan.infura.io/v3/d1c5b591e99548519b995325db92d039'
);
//'https://rinkeby.infura.io/v3/5803fca81131450ab4445ee2d3b740ad'

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