'use client';
import { AppStore, makeStore } from './store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// Buat store dan persistor di luar komponen untuk menghindari pengulangan inisialisasi
const store = makeStore();
const persistor = persistStore(store);

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}
