#!/usr/bin/env ts-node

import app from '../../app';
import * as http from 'http';
import debug from 'debug';
import sequelize from '../models';

const logger = debug('myapp:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

sequelize.sync({ force: false }) // Postaviti `force: true` za resetiranje tablica
    .then(() => {
      console.log('Baza podataka je uspješno sinhronizirana');
      logger('Baza podataka je uspješno sinhronizirana');
    })
    .catch((error) => {
      console.error('Greška pri sinhronizaciji baze podataka:', error);
      logger('Greška pri sinhronizaciji baze podataka:', error);
    });



function normalizePort(val: string): number | string {
  const portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    return val;
  }
  if (portNumber >= 0) {
    return portNumber;
  }
  return '0';
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' zahtijeva viša prava pristupa.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' je već u upotrebi.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  logger('Slušam na ' + bind);
}
