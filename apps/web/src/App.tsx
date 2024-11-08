// src/pages/_app.tsx (Pastikan file ini ada di proyek Anda)
import { Provider } from 'react-redux';
import store from './redux/store'; // Pastikan ini sesuai dengan letak store Redux Anda
import '../styles/globals.css';

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <Provider store={store}>
      {' '}
      {/* Bungkus aplikasi dengan Provider */}
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
