import App from './app';
import dotenv from 'dotenv';
const PORT = process.env.PORT || 3000;
dotenv.config();

// const main = () => {
// init db here
const app = new App(PORT);
app.start();
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// };

// main();
