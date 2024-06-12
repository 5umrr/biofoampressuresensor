const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = new SerialPort('COM4', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

app.use(express.static('public'));

parser.on('data', (data) => {
  const value = parseInt(data, 10);
  if (!isNaN(value)) {
    io.emit('data', value);
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
