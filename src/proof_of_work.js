const {hash} = require('./utils.js');


module.exports = {
    proofOfWork({data, previousHash, timestamp}) {
        let proof = 0;
        let blockHash;
        while(true){
            proof++;
            const block = `${data}${previousHash}${timestamp}${proof}`;
            blockHash = hash(block)
            if(blockHash.substr(0, 4) === '0000' ){
                console.log(blockHash)
                break;
            }
        }
        
        return {proof, blockHash};
    },
    checkPOW({data, previousHash, timestamp, proof}){
        const block = `${data}${previousHash}${timestamp}${proof}`;
        const BlockHash = hash(block);
        return BlockHash.substr(0, 5) === 0;
    }
}