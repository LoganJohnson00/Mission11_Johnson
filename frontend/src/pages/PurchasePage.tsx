import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useState } from 'react';
import type { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';

function PurchasePage() {
  const navigate = useNavigate();
  const { title, bookId } = useParams();
  const { addToCart } = useCart();
  const [donationAmount, setDonationAmount] = useState<number>(0);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No project found',
      donationAmount,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {title}</h2>
      <div>
        <input
          type="number"
          placeholder="Enter donation amount"
          value={donationAmount}
          onChange={(x) => setDonationAmount(Number(x.target.value))}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}
export default PurchasePage;
