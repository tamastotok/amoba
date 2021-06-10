import io from 'socket.io-client';

const ENDPOINT = 'https://amoba-server.herokuapp.com';
const LOCAL = 'http://localhost:5000';
const socket = io(ENDPOINT || LOCAL);

export default socket;
