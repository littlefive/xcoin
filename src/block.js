const fs = require('fs');
const crypto = require('crypto');

module.exports = class {
    constructor(data, previousHash) {
        let hash = this.getHash(data, previousHash);
        this.hash = hash || '';
        this.previousHash = previousHash || '';
        this.timestamp = new Date();
        this.data = data || '';
    }
    getHash(data, previousHash) {
        let block = `${data}${previousHash}${Date.now()}`;
        let hash = this.md5(block);
        return hash;
    }
    md5(string) {
        return crypto.createHash('sha256').update(string).digest('hex')
    }
}