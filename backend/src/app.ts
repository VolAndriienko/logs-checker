import server from './server';
// this is not working
// import * as dotenv from 'dotenv';
// dotenv.config();

const starter = new server()
  .start(parseInt(process.env.PORT || '8081'))
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => console.log(error));

export default starter;