import './Account.css';
import { RiUser3Line } from 'react-icons/ri';
import {
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiMapPin,
  FiX
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { useProductContext } from '../../context/ProductContext';

type User = {
  firstName: string;
  secondName: string;
  email: string;
  phone?: string;
  city?: string;
  createdAt: string;
};

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
}

interface OrderType {
  id: string;
  createdAt: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  subtotal: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  items: OrderItem[];
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeSection, setActiveSection] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('profile');

  // Profile Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  // Wishlist context products
  const { products } = useProductContext();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      if (!token) {
        console.error('No token found, redirecting to login');
        window.location.href = '/auth/form';
        return;
      }

      try {
        // Fetch User Profile
        const response = await fetch(`${API_BASE_URL}/account`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem('token');
          window.location.href = '/auth/form';
          return;
        }

        setUser(data.user);
        // Set edit defaults
        setEditFirstName(data.user.firstName || '');
        setEditLastName(data.user.secondName || '');
        setEditPhone(data.user.phone || '');
        setEditCity(data.user.city || '');

        // Fetch User Orders
        const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.orders || []);
        }
      } catch (error) {
        console.error('Error fetching profile or orders:', error);
        localStorage.removeItem('token');
        window.location.href = '/auth/form';
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchProfileAndOrders();
  }, [token]);

  // Load wishlist items from localStorage
  useEffect(() => {
    const storedFavs = localStorage.getItem('setupek_favorites');
    if (storedFavs && products.length > 0) {
      try {
        const ids = JSON.parse(storedFavs) as number[];
        const filtered = products.filter(p => ids.includes(p.id));
        setWishlistItems(filtered);
      } catch (e) {
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  }, [products, activeSection]);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/auth/form';
  };

  const handleSaveChanges = async () => {
    if (!editFirstName || !editLastName) {
      setEditMessage('First name and last name are required');
      setEditSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/account/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editFirstName,
          secondName: editLastName,
          phone: editPhone,
          city: editCity
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setEditSuccess(true);
        setEditMessage('Profile updated successfully!');
        setTimeout(() => {
          setIsEditing(false);
          setEditMessage('');
        }, 1500);
      } else {
        setEditSuccess(false);
        setEditMessage(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setEditSuccess(false);
      setEditMessage('An error occurred. Please try again.');
    }
  };

  if (!user)
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        Loading profile...
      </div>
    );

  const navItems = [
    { icon: <RiUser3Line />, label: 'Profile', key: 'profile' },
    { icon: <FiShoppingBag />, label: 'Orders', key: 'orders' },
    { icon: <FiHeart />, label: 'Wishlist', key: 'wishlist' },
    { icon: <FiMapPin />, label: 'Addresses', key: 'addresses' },
    { icon: <FiSettings />, label: 'Settings', key: 'settings' },
  ] as const;

  return (
    <div className="account-page">
      <aside className="account-sidebar">
        <div className="account-profile-head">
          <div className="account-avatar">
            <RiUser3Line />
          </div>
          <h3>
            {user?.firstName} {user?.secondName}
          </h3>
          <p>{user?.email}</p>
        </div>

        <nav className="account-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.key);
              }}
              className={`account-nav-item ${activeSection === item.key ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
          <div className="account-nav-divider" />
          <a href="#" onClick={handleSignOut} className="account-nav-item">
            <FiLogOut />
            <span>Sign Out</span>
          </a>
        </nav>
      </aside>

      <div className="account-content">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="account-section">
            <div className="account-section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button className="account-edit-btn" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
            </div>

            {editMessage && (
              <p style={{ color: editSuccess ? 'green' : 'red', margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {editMessage}
              </p>
            )}

            {isEditing ? (
              <div className="account-info-form" style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="checkout-field">
                    <label>First Name</label>
                    <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
                  </div>
                  <div className="checkout-field">
                    <label>Last Name</label>
                    <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
                  </div>
                </div>
                <div className="checkout-field">
                  <label>Email (Cannot be modified)</label>
                  <input type="email" value={user.email} disabled style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="checkout-field">
                    <label>Phone</label>
                    <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                  </div>
                  <div className="checkout-field">
                    <label>City</label>
                    <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="checkout-place-btn" onClick={handleSaveChanges} style={{ padding: '10px 20px', fontSize: '14px', width: 'auto' }}>
                    Save Changes
                  </button>
                  <button
                    className="account-edit-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setEditFirstName(user.firstName);
                      setEditLastName(user.secondName);
                      setEditPhone(user.phone || '');
                      setEditCity(user.city || '');
                      setEditMessage('');
                    }}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="account-info-grid">
                <div className="account-info-field">
                  <label>First Name</label>
                  <span>{user?.firstName}</span>
                </div>
                <div className="account-info-field">
                  <label>Last Name</label>
                  <span>{user?.secondName}</span>
                </div>
                <div className="account-info-field">
                  <label>Email</label>
                  <span>{user?.email}</span>
                </div>
                <div className="account-info-field">
                  <label>Phone</label>
                  <span>{user?.phone || 'Not specified'}</span>
                </div>
                <div className="account-info-field">
                  <label>City</label>
                  <span>{user?.city || 'Not specified'}</span>
                </div>
                <div className="account-info-field">
                  <label>Member Since</label>
                  <span>
                    {user?.createdAt ? (
                      new Date(user.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div className="account-section">
            <div className="account-section-header">
              <h2>My Order History</h2>
            </div>
            {loadingOrders ? (
              <p style={{ padding: '20px 0' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <p>You haven't placed any orders yet.</p>
                <a href="/shop" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
                  Start Shopping →
                </a>
              </div>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <p className="order-id">{order.id}</p>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`order-status ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="order-items-preview">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item-thumb" title={item.name}>
                          <img src={item.image} alt={item.name} />
                        </div>
                      ))}
                    </div>

                    <div className="order-card-footer">
                      <span className="order-total">{order.total} MAD</span>
                      <a href="#" className="order-detail-link" onClick={(e) => { e.preventDefault(); setSelectedOrder(order); }}>
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Section */}
        {activeSection === 'wishlist' && (
          <div className="account-section">
            <div className="account-section-header">
              <h2>My Favorites</h2>
            </div>
            {wishlistItems.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <p>No products added to favorites yet.</p>
                <a href="/shop" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
                  Browse Catalog →
                </a>
              </div>
            ) : (
              <div className="shop-grid" style={{ marginTop: '20px' }}>
                {wishlistItems.map((p) => (
                  <a href={`/product/${p.id}`} key={p.id} className="shop-card" style={{ textDecoration: 'none' }}>
                    <div className="shop-card-img">
                      <img src={p.image} alt={p.title} loading="lazy" />
                      {p.discount && <span className="shop-card-badge">{p.discount}</span>}
                    </div>
                    <div className="shop-card-info">
                      <p className="shop-card-brand">{p.brand}</p>
                      <p className="shop-card-title">{p.title}</p>
                      <div className="shop-card-bottom" style={{ marginTop: '10px' }}>
                        <span className="shop-card-price">{p.price}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Section */}
        {activeSection === 'addresses' && (
          <div className="account-section">
            <div className="account-section-header">
              <h2>My Shipping Addresses</h2>
              <button className="account-edit-btn" style={{ padding: '8px 15px', fontSize: '13px' }} onClick={() => alert('Feature coming soon!')}>
                Add New Address
              </button>
            </div>
            <div className="addresses-grid" style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', position: 'relative' }}>
                <span style={{ fontSize: '11px', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '4px', position: 'absolute', top: '15px', right: '15px' }}>
                  Default
                </span>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{user.firstName} {user.secondName}</h4>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{user.phone || 'Phone: +212 X-XXXXXX'}</p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>123 Boulevard d'Anfa</p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{user.city || 'Casablanca'}, 20000</p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Morocco</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="account-section">
            <div className="account-section-header">
              <h2>Account Settings</h2>
            </div>
            <div className="settings-form" style={{ display: 'grid', gap: '25px', maxWidth: '500px', marginTop: '20px' }}>
              <div className="checkout-section" style={{ border: 'none', padding: 0 }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Security</h4>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div className="checkout-field">
                    <label>Current Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="checkout-field">
                    <label>New Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="checkout-field">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <button className="checkout-place-btn" onClick={() => alert('Password successfully updated!')} style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', marginTop: '15px' }}>
                  Change Password
                </button>
              </div>

              <div className="settings-divider" style={{ borderBottom: '1px solid var(--border)' }} />

              <div>
                <h4 style={{ margin: '0 0 15px 0' }}>Preferences</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Receive newsletter updates and hot deals promotion alerts.</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '25px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <button style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              border: 'none',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#333'
            }} onClick={() => setSelectedOrder(null)}>
              <FiX />
            </button>

            <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>Order Details</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: '0 0 20px 0' }}>{selectedOrder.id}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', fontSize: '14px' }}>
              <div>
                <h5 style={{ margin: '0 0 5px 0', color: '#888' }}>Order Summary</h5>
                <p style={{ margin: '3px 0' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p style={{ margin: '3px 0' }}><strong>Status:</strong> <span className={`order-status ${selectedOrder.status}`} style={{ display: 'inline', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{selectedOrder.status}</span></p>
                <p style={{ margin: '3px 0' }}><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <h5 style={{ margin: '0 0 5px 0', color: '#888' }}>Shipping Address</h5>
                <p style={{ margin: '3px 0' }}>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                <p style={{ margin: '3px 0' }}>{selectedOrder.shippingAddress.address}</p>
                <p style={{ margin: '3px 0' }}>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                <p style={{ margin: '3px 0' }}>{selectedOrder.shippingAddress.phone}</p>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '15px' }} />

            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Items Summary</h4>
            <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
              {selectedOrder.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '6px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{item.name}</p>
                    <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>Qty: {item.quantity} x {item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '15px' }} />

            <div style={{ display: 'grid', gap: '5px', alignSelf: 'flex-end', justifyItems: 'end', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '50px' }}>
                <span style={{ color: '#888' }}>Subtotal:</span>
                <span>{selectedOrder.subtotal} MAD</span>
              </div>
              <div style={{ display: 'flex', gap: '50px' }}>
                <span style={{ color: '#888' }}>Shipping:</span>
                <span style={{ color: 'green' }}>Free</span>
              </div>
              <div style={{ display: 'flex', gap: '50px', fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
                <span>Total:</span>
                <span>{selectedOrder.total} MAD</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
