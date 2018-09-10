let Block = require('./block.js');
let config = require('./genesis_block_config.js');
let crypto = require('crypto');
const argv = require('minimist')(process.argv.slice(2));

class blockChain {
    constructor() {
        const genesis = new Block(config.genesis);
        this.chain = [genesis];
    }
    addBlock() {
        let chain = this.chain;
        let preBlock = this.lastBlock();
        let preHash = preBlock.hash;

        const block = new Block('data', preHash)
        this.chain.push(block)
    }
    addNewBlockchain(){

    }
    lastBlock() {
        return this.chain.slice(-1)[0]
    }
}


let list = new blockChain();
list.addBlock();

console.log(list)

let hash1 = crypto.createHmac('sha256', 'ss')
    .update('created by jollen')
    .digest('hex');
