import Header from './Components/Header/Header.tsx';
import Footer from './Components/Footer/Footer.tsx';
import FloatingWhatsApp from './Components/FloatingWhatsApp/FloatingWhatsApp.tsx';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Form from './pages/Auth/Form.tsx';
import Favorites from './pages/Favorites/favorites.tsx';
import Cart from './pages/Cart/Cart.tsx';
import Account from './pages/Auth/Account.tsx';
import InfiniteSlider from './Components/infiniteSlider/InfiniteSlider.tsx';
import Shop from './pages/Shop/Shop.tsx';
import Product from './pages/Product/Product';
import Checkout from './pages/Checkout/Checkout.tsx';
import Mouses from './Categories/Mouses.tsx';
import MousePads from './Categories/MousePads.tsx';
import Keyboards from './Categories/Keyboards.tsx';
import Controllers from './Categories/Controllers.tsx';
import Accessories from './Categories/Accessories.tsx';
import Headsets from './Categories/Headsets.tsx';
import Microphone from './Categories/Microphones.tsx';
import IEM from './Categories/IEMS.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { FavoritesProvider } from './context/useFavorites.tsx';
import { ProductProvider } from './context/ProductContext.tsx';

const App = () => {
  return (
    <ProductProvider>
      <FavoritesProvider>
        <CartProvider>
          <Header />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/form" element={<Form />} />
          <Route path="/Favorites/Favorites" element={<Favorites />} />
          <Route path="/Cart/Cart" element={<Cart />} />
          <Route path="/auth/Account" element={<Account />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/category/Mouse" element={<Mouses />} />
          <Route path="/category/Keyboards" element={<Keyboards />} />
          <Route path="/category/Headsets" element={<Headsets />} />
          <Route path="/category/Mousepads" element={<MousePads />} />
          <Route path="/category/Controllers" element={<Controllers />} />
          <Route path="/category/Microphones" element={<Microphone />} />
          <Route path="/category/IEM" element={<IEM />} />
          <Route path="/category/Accessories" element={<Accessories />} />
        </Routes>
        <InfiniteSlider />
        <Footer />
        <FloatingWhatsApp />
      </CartProvider>
    </FavoritesProvider>
    </ProductProvider>
  );
};

export default App;
