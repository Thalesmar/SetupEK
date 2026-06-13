import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import { CartContext } from '../../context/CartContext';
import { API_BASE_URL } from '../../config';

const Checkout = () => {
  const cart = useContext(CartContext);
  const cartItems = cart?.cartItems ?? [];
  const navigate = useNavigate();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [region, setRegion] = useState('Casablanca-Settat');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard route & Prefill user details if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Unauthorized access to checkout, redirecting to login');
      navigate('/auth/form');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setFirstName(data.user.firstName || '');
            setLastName(data.user.secondName || '');
            setEmail(data.user.email || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile for checkout prefill:', error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/[^\d.]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  const handlePlaceOrder = async () => {
    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/form');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          total,
          shippingAddress: {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            postalCode,
            region,
          },
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart in context and storage
        cart?.clearCart();
        alert('Order placed successfully! Redirecting to your account dashboard.');
        navigate('/auth/Account');
      } else {
        setMessage(data.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1>Your Cart is Empty</h1>
        <p>Add some products to your cart before proceeding to checkout.</p>
        <button className="checkout-place-btn" onClick={() => navigate('/shop')} style={{ maxWidth: '300px', margin: '20px auto' }}>
          Go to Shop
        </button>
      </div>
    );
  }

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

      {message && (
        <div className="checkout-message" style={{ color: 'red', textAlign: 'center', margin: '15px 0', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      <div className="checkout-forms">
        {/* Contact */}
        <div className="checkout-section">
          <h3>Contact Information</h3>
          <div className="checkout-grid">
            <div className="checkout-field">
              <label>First Name *</label>
              <input type="text" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="checkout-field">
              <label>Last Name *</label>
              <input type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="checkout-field span2">
              <label>Email *</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="checkout-field span2">
              <label>Phone *</label>
              <input type="tel" placeholder="+212 6 XX XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="checkout-section">
          <h3>Shipping Address</h3>
          <div className="checkout-grid">
            <div className="checkout-field span2">
              <label>Address *</label>
              <input type="text" placeholder="123 Street Name" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="checkout-field">
              <label>City *</label>
              <input type="text" placeholder="Casablanca" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="checkout-field">
              <label>Postal Code *</label>
              <input type="text" placeholder="20000" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            </div>
            <div className="checkout-field span2">
              <label>Region *</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="Casablanca-Settat">Casablanca-Settat</option>
                <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
                <option value="Fès-Meknès">Fès-Meknès</option>
                <option value="Marrakech-Safi">Marrakech-Safi</option>
                <option value="Tanger-Tétouan-Al Hoceïma">Tanger-Tétouan-Al Hoceïma</option>
                <option value="Souss-Massa">Souss-Massa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="checkout-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label className={`payment-method ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
              />
              <div>
                <p className="payment-method-label">Cash on Delivery</p>
                <p className="payment-method-sub">Pay when your order arrives</p>
              </div>
            </label>
            <label className={`payment-method ${paymentMethod === 'Bank Transfer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="Bank Transfer"
                checked={paymentMethod === 'Bank Transfer'}
                onChange={() => setPaymentMethod('Bank Transfer')}
              />
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
            <img src={item.image} alt={item.name} />
            <div className="checkout-summary-item-info">
              <p className="checkout-summary-item-title">{item.name} x{item.quantity}</p>
              <p className="checkout-summary-item-price">{item.price}</p>
            </div>
          </div>
        ))}

        <div className="checkout-summary-row"><span>Subtotal</span><span>{subtotal.toFixed(0)} MAD</span></div>
        <div className="checkout-summary-row"><span>Shipping</span><span>Free</span></div>
        <div className="checkout-summary-row total"><span>Total</span><span>{total.toFixed(0)} MAD</span></div>

        <button className="checkout-place-btn" onClick={handlePlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
        <p className="checkout-secure">🔒 Secure & trusted checkout</p>
      </div>
    </div>
  );
};

export default Checkout;
