import { useContext } from 'react';
import './Checkout.css';
import { CartContext } from '../../context/CartContext';

const Checkout = () => {
  const cart = useContext(CartContext);
  const cartItems = cart?.cartItems ?? [];

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(' MAD', ''));
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-steps">
        <div className="checkout-step done"><span className="step-num">✓</span><span>Cart</span></div>
        <div className="step-line" />
        <div className="checkout-step active"><span className="step-num">2</span><span>Details</span></div>
        <div className="step-line" />
        <div className="checkout-step"><span className="step-num">3</span><span>Payment</span></div>
        <div className="step-line" />
        <div className="checkout-step"><span className="step-num">4</span><span>Confirm</span></div>
      </div>

      <div className="checkout-forms">
        {/* Contact */}
        <div className="checkout-section">
          <h3>Contact Information</h3>
          <div className="checkout-grid">
            <div className="checkout-field"><label>First Name</label><input type="text" placeholder="John" /></div>
            <div className="checkout-field"><label>Last Name</label><input type="text" placeholder="Doe" /></div>
            <div className="checkout-field span2"><label>Email</label><input type="email" placeholder="your@email.com" /></div>
            <div className="checkout-field span2"><label>Phone</label><input type="tel" placeholder="+212 6 XX XX XX XX" /></div>
          </div>
        </div>

        {/* Shipping */}
        <div className="checkout-section">
          <h3>Shipping Address</h3>
          <div className="checkout-grid">
            <div className="checkout-field span2"><label>Address</label><input type="text" placeholder="123 Street Name" /></div>
            <div className="checkout-field"><label>City</label><input type="text" placeholder="Casablanca" /></div>
            <div className="checkout-field"><label>Postal Code</label><input type="text" placeholder="20000" /></div>
            <div className="checkout-field span2">
              <label>Region</label>
              <select>
                <option>Casablanca-Settat</option>
                <option>Rabat-Salé-Kénitra</option>
                <option>Fès-Meknès</option>
                <option>Marrakech-Safi</option>
                <option>Tanger-Tétouan-Al Hoceïma</option>
                <option>Souss-Massa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="checkout-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label className="payment-method selected">
              <input type="radio" name="payment" defaultChecked />
              <div>
                <p className="payment-method-label">Cash on Delivery</p>
                <p className="payment-method-sub">Pay when your order arrives</p>
              </div>
            </label>
            <label className="payment-method">
              <input type="radio" name="payment" />
              <div>
                <p className="payment-method-label">Bank Transfer</p>
                <p className="payment-method-sub">Transfer to our account before shipping</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="checkout-summary">
        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="checkout-summary-item">
            <img src={item.image} alt={item.title} />
            <div className="checkout-summary-item-info">
              <p className="checkout-summary-item-title">{item.title} x{item.quantity}</p>
              <p className="checkout-summary-item-price">{item.price}</p>
            </div>
          </div>
        ))}

        <div className="checkout-summary-row"><span>Subtotal</span><span>{subtotal.toFixed(2)} MAD</span></div>
        <div className="checkout-summary-row"><span>Shipping</span><span>Free</span></div>
        <div className="checkout-summary-row total"><span>Total</span><span>{total.toFixed(2)} MAD</span></div>

        <button className="checkout-place-btn">Place Order</button>
        <p className="checkout-secure">🔒 Secure & trusted checkout</p>
      </div>
    </div>
  );
};

export default Checkout;
