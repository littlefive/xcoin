const crypto = require('crypto');

module.exports = {
    hash(string) {
        return crypto.createHash('sha256').update(string).digest('hex')
    }
}