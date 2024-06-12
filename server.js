const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport'); // Updated import statement
const { ReadlineParser } = require('@serialport/parser-readline'); // Updated import statement

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let port;
let parser;

function setupSerialPort() {
  port = new SerialPort({ path: 'COM4', baudRate: 9600 }); 
  parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' })); // Updated usage

  parser.on('data', (data) => {
    const value = parseInt(data, 10);
    if (!isNaN(value)) {
      io.emit('data', value);
    }
  });

  port.on('error', (err) => {
    console.error('Serial port error:', err);
    reconnectSerialPort();
  });

  port.on('close', () => {
    console.log('Serial port closed. Reconnecting...');
    reconnectSerialPort();
  });
}

function reconnectSerialPort() {
  setTimeout(() => {
    console.log('Reconnecting serial port...');
    setupSerialPort();
  }, 1000); // Attempt to reconnect after 1 second
}

setupSerialPort();

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
