const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 =  new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await new web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({ data: bytecode })
                .send({from: accounts[0], gas: '1000000'})
});

describe('Lottery Contract', () => {
    //Remember: beforeEach() function always execute before the it() function
    it('Deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('Allows one player to enter the lottery', async () => {
    await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getplayers().call({
            from: accounts[0]
        })

        assert.ok(accounts[0], players[0]);
        assert.ok(1, players.length);
    });

    
    it('Allows multiple players to enter the lottery', async () => {
        await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.02', 'ether')
            });

            await lottery.methods.enter().send({
                from: accounts[1],
                value: web3.utils.toWei('0.02', 'ether')
            });

            await lottery.methods.enter().send({
                from: accounts[2],
                value: web3.utils.toWei('0.02', 'ether')
            });
    
            const players = await lottery.methods.getplayers().call({
                from: accounts[0]
            })
    
            assert.ok(accounts[0], players[0]);
            assert.ok(accounts[1], players[1]);
            assert.ok(accounts[2], players[2]);
            assert.ok(3, players.length);
        });

        it('it requires a minimum amount of ether to enter', async () => {
            try{
                await lottery.methods.enter().send({
                    from: accounts[0],
                    value: 0
                }); 
            }catch(err){
                assert(err);
            }      
        });

        it('Only manager can pick a winner', async () => {
            try {
                await lottery.methods.pickWinner().send({
                    from: accounts[1]
                });
                assert(false);
            }catch(err) {
                assert(err);
            }
        });

        it('sends money to the winner', async () => {
            await lottery.methods.enter().send ({
                from: accounts[0],
                value: web3.utils.toWei('2', 'ether')
            });

            const initBalance = await web3.eth.getBalance(accounts[0]);

            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });

            const finalBalance = await web3.eth.getBalance(accounts[0]);
            const difference = finalBalance - initBalance;

            //we are using 1.8 to accomodate the gas spent in the entering the  contract
            assert(difference > web3.utils.toWei('1.8', 'ether'));
        })
})