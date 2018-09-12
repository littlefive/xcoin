
const blockChain = require('./block_chain.js');
const WebSocket = require('ws');
const BrewNode = function(port){
    let brewSockets = [];
    let brewServer;
    let _port = 8888
    let chain = new blockChain();

    function init(){
        brewServer = new WebSocket.Server({ port: _port });
        
        brewServer.on('connection', (connection) => {
            console.log('connection in');
            initConnection(connection);
        });     
    }

    const messageHandler = (connection) =>{
        connection.on('message', (data) => {
            console.log('Message In:');
            const msg = JSON.parse(data);

            console.log(msg.event);
        });
        console.log('message handler setup');
    }

    const broadcastMessage = (message) => {
        console.log('sending to all '+message)
        brewSockets.forEach(node => node.send(JSON.stringify({event: message})))
    }

    const closeConnection = (connection) => {
        console.log('closing connection');
        brewSockets.splice(brewSockets.indexOf(connection),1);
    }

    const initConnection = (connection) => {
        console.log('init connection');

        messageHandler(connection);
        
        brewSockets.push(connection);

        connection.on('error', () => closeConnection(connection));
        connection.on('close', () => closeConnection(connection));
    }

    const addBlock = (teammember) => {
        let newBlock = chain.addBlock(teammember)
        chain.addToChain(newBlock);
    }

    const getStats = () => {
        return {
            blocks: chain.getTotalBlocks()
        }
    }

    const addPeer = (host, port) => {
        let connection = new WebSocket(`ws://${host}:${port}`);

        connection.on('error', (error) =>{
            console.log(error);
        });

        connection.on('open', (msg) =>{
            initConnection(connection);
        });
    }

    return {
        init,
        broadcastMessage,
        addPeer,
        addBlock,
        getStats
    }
}


let node = BrewNode();
node.init()