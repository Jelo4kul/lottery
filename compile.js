const path = require('path');
const fs = require('fs');
const solCompiler = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const lotteryContent = fs.readFileSync(lotteryPath, 'utf8');

module.exports = solCompiler.compile(lotteryContent, 1).contracts[':Lottery'];