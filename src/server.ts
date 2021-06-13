import io from 'socket.io-client';

/*
  For develop, change the endpoint to your local server url,
  example: 'http://localhost:5000'
*/

const ENDPOINT = 'https://amoba-server.herokuapp.com';
//const ENDPOINT = 'http://localhost:5000';
const socket = io(ENDPOINT);

export default socket;
