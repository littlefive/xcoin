const fs = require('fs');
const {proofOfWork} = require('./proof_of_work.js');
const {hash} = require('./utils.js')
module.exports = class {
    constructor(data, previousHash) {
        this.previousHash = previousHash || '';
        const timestamp = this.timestamp = new Date();
        this.data = data || '';
        const {pow, blockHash} = proofOfWork({data, timestamp , previousHash});
        this.pow = pow;
        this.hash = blockHash;
        this.nonce = '';
    }
    getHash(data, previousHash) {
        let block = `${data}${previousHash}${Date.now()}`;
        let blockhash = hash(block);
        return blockhash;
    }
}