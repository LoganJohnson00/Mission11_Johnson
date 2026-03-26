import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useRef, useState } from 'react';
import type { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { Toast } from 'bootstrap';

function PurchasePage() {
  const navigate = useNavigate();
  const { title, bookId, price } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const toastRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No book found',
      price: Number(price),
      quantity,
    };
    addToCart(newItem);
    // Show the toast
    if (toastRef.current) {
      const toast = new Toast(toastRef.current);
      toast.show();
    }

    // Navigate to cart after a short delay so the user sees the toast
    setTimeout(() => navigate('/cart'), 1000);
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {title}</h2>
      <div>
        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          min={1}
          onChange={(x) => setQuantity(Number(x.target.value))}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate(-1)}>Go Back</button>

      {/* Bootstrap Toast */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-success border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              Added {quantity} x {title} to cart!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}
export default PurchasePage;
