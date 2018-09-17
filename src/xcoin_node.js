
const blockChain = require('./block_chain.js');
const WebSocket = require('ws');
const _ = require('lodash');
let port = process.env.PORT || 8888
let myAddrList = [{ip:'127.0.0.1', port:8888}];
const BrewNode = function(){
    let brewSockets = [];
    
    let brewServer;
    let _port = port
    let chain = new blockChain();
    function init(){
        brewServer = new WebSocket.Server({ port: _port });
        brewServer.on('connection', (connection) => {
            initConnection(connection);
        });     
    }

    const messageHandler = (connection) =>{
        connection.on('message', (data) => {
            const msg = JSON.parse(data);
            console.log(msg)
            switch (msg.event) {
                case 'block':
                    console.log(msg)
                    break;
                case 'myAddr':
                    let nodeAddr = {
                        ip: msg.ip,
                        port: msg.port
                    };
                    let node = _.findIndex(myAddrList, nodeAddr);
                    if (node === -1) {
                        myAddrList.forEach( otherNode => {
                            addPeer(otherNode.ip, otherNode.port, nodeAddr.ip, nodeAddr.port,)
                        });
                        myAddrList.push(nodeAddr);
                        // broadcastPeerNode(msg);
                        connection.close();
                    };

                    console.log(myAddrList);
                    break;  
                default:  
                    console.log('Unknown message');
            }
        });
    }

    const broadcastMessage = (message, socket) => {
        brewSockets.forEach( otherSocket => {
            if (otherSocket !== socket) {
                otherSocket.send(JSON.stringify({event: message}));
            }
        });
    }
    const broadcastPeerNode = (message, socket) => {
        brewSockets.forEach( otherSocket => {
            if (otherSocket !== socket) {
                otherSocket.send(JSON.stringify(message));
            }
        });
    }
    const closeConnection = (connection) => {
        console.log('closing connection');
        brewSockets.splice(brewSockets.indexOf(connection),1);
    }

    const initConnection = (connection) => {
        messageHandler(connection);
        brewSockets.push(connection);
        connection.on('error', () => closeConnection(connection));
        connection.on('close', () => closeConnection(connection));
    }

    const addBlock = (teammember) => {
        let newBlock = chain.addBlock('s');
        console.log(myAddrList)
        myAddrList.forEach( otherNode => {
            console.log(otherNode)
            let connection = new WebSocket(`ws://${otherNode.host}:${otherNode.port}`);
            connection.on('open', (msg) =>{
                connection.send(JSON.stringify({event: 'block', newBlock}))
            });
        });
    }

    const getStats = () => {
        return {
            blocks: chain.getTotalBlocks()
        }
    }

    const addPeer = (host, port, myhost, myport) => {
        let connection = new WebSocket(`ws://${host}:${port}`);
        connection.on('error', (error) =>{
            console.log(error);
        });
        connection.on('open', (msg) =>{
            connection.send(JSON.stringify({event: 'myAddr',ip: myhost, port: myport}))
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
node.init();
if (port !== 8888) {
    setTimeout(function(){
        node.addPeer('127.0.0.1', 8888, '127.0.0.1', port);
        node.addBlock();
    }, 3000)
}
