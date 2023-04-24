// No idea if this will work, but essentially this script creates a socket server, then responds to messages. Port 8124


module.exports = {
    SetupDCSListener: function() {
        const net = require('net');
        const server = net.createServer(socket => {
            global.socket = socket;
            // 'connection' listener
            let clientconnected = 1;
            console.log('client connected');
            socket.on('end', () => {
                const clientconnected = 0;
                console.log('client disconnected');
            });
            socket.pipe(socket);
            socket.on('data', (data) => {
                console.log(`Results: ${data}`);
                const socketresults = `Results: ${data}`;
            });
            
        });
        server.on('error', err => {
            console.log(err);
        });
        server.listen(8124, () => {
            console.log('DCS to U64 Listener enabled.');   
        });
    }, 
    testDCS: function() {
        global.socket.write('loadMissionFile');
        console.log('i did the thing... ');
        global.socket.pipe(socket);
        global.socket.on('data', (data) => {
            console.log(`Results: ${data}`);
        });
    }
}