let Block = require('./block.js');
let config = require('./genesis_block_config.js');
let crypto = require('crypto');

class blockChain {
    constructor() {
        const genesis = new Block(config.genesis);
        this.chain = [genesis];
    }
    addBlock(block) {
        this.chain.push(block)
    }
    addNewBlockchain(){
        
    }
}


let list = new blockChain();
list.addBlock();



let hash1 = crypto.createHmac('sha256', 'ss')
    .update('created by jollen')
    .digest('hex');
