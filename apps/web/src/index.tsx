// frontend/src/pages/index.tsx
import OrderForm from './components/OutletForm';

const Home = () => {
  return (
    <div>
      <h1>Formulir Pesanan</h1>
      <OrderForm /> {/* Komponen yang dibungkus dalam Provider */}
    </div>
  );
};

export default Home;
