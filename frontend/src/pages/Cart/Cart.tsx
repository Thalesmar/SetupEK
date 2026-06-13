import './Cart.css';
import { useContext } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { CartContext } from '../../context/CartContext';

const Cart = () => {
  const cart = useContext(CartContext);
  const cartItems = cart?.cartItems ?? [];
  const cartCount = cart?.cartCount ?? 0;

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/[^\d.]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1 style={{ gridColumn: '1 / -1' }}>Your Cart</h1>
        <div className="cart-empty" style={{ gridColumn: '1 / -1' }}>
          <h2>YOUR CART IS EMPTY</h2>
          <a href="/shop" className="cart-continue">← Start Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart ({cartCount} items)</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-img">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="cart-item-info">
              <p className="cart-item-title">{item.name}</p>
              <span className="cart-item-variant">Qty: {item.quantity}</span>
            </div>

            <div className="cart-item-right">
              <span className="cart-item-price">{item.price}</span>
              <div className="cart-qty">
                <button onClick={() => cart?.updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => cart?.updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="cart-item-remove" onClick={() => cart?.removeFromCart(item.id)}>
                <IoTrashOutline />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>

        <div className="cart-summary-row"><span>Subtotal ({cartCount} items)</span><span>{total.toFixed(0)} MAD</span></div>
        <div className="cart-summary-row"><span>Shipping</span><span>Free</span></div>
        <div className="cart-summary-row"><span>Discount</span><span>− 0 MAD</span></div>

        <div className="cart-coupon">
          <input type="text" placeholder="Coupon code" />
          <button>Apply</button>
        </div>

        <div className="cart-summary-row total"><span>Total</span><span>{total.toFixed(0)} MAD</span></div>

        <a href="/checkout"><button className="cart-checkout-btn">Proceed to Checkout</button></a>
        <a href="/shop" className="cart-continue">← Continue Shopping</a>
      </div>
    </div>
  );
};

export default Cart;
