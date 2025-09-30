import io from 'socket.io-client';

/*
  For develop, change the endpoint to your local server url,
  example: 'http://localhost:5000'
*/
const ENDPOINT = import.meta.env.VITE_API_URL;
//const ENDPOINT = 'https://amoba-server.herokuapp.com';
const socket = io(ENDPOINT);

export default socket;
