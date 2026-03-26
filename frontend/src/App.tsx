import './App.css';
import { CartProvider } from './context/CartContext';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import DonatePage from './pages/PurchasePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/donate/:title/:bookId" element={<DonatePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
