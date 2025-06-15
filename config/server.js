import http from 'http';
import app from '../app/index.js';

const server = http.createServer(app);

export default server;
