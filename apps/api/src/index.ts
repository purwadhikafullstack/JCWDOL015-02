import App from './app';
import dotenv from 'dotenv';
dotenv.config();

const main = () => {
  // init db here

  const app = new App();
  app.start();
};

main();
