module.exports = class {
	constructor(block){
		this.hash = block.hash || '';
		this.previousHash = block.previous || '';
		this.timestamp = block.timestamp || new Date();
		this.merkleRoot = block.merkleRoot || {};
	}
}
