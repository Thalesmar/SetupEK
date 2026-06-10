import './Account.css';
import { RiUser3Line } from 'react-icons/ri';
import {
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiMapPin,
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

type User = {
  firstName: string;
  secondName: string;
  email: string;
  createdAt: string;
};

const orders = [
  {
    id: '#EK-2025-0041',
    date: 'Jul 12, 2025',
    status: 'delivered',
    statusLabel: 'Delivered',
    total: '838 MAD',
    items: [
      { image: '/assets/new-arrival/VXE-R1-Wireless-Black.png' },
      { image: '/assets/hot-deals/hot-product-1.png' },
    ],
  },
  {
    id: '#EK-2025-0038',
    date: 'Jun 28, 2025',
    status: 'shipped',
    statusLabel: 'Shipped',
    total: '519 MAD',
    items: [
      { image: '/assets/new-arrival/FGG-MADLIONS-NANO68-HE-ANSI-US-White.png' },
    ],
  },
  {
    id: '#EK-2025-0031',
    date: 'Jun 05, 2025',
    status: 'processing',
    statusLabel: 'Processing',
    total: '1,198 MAD',
    items: [
      { image: '/assets/hot-deals/hot-product-3.png' },
      { image: '/assets/hot-deals/hot-product-5.png' },
    ],
  },
];

const navItems = [
  { icon: <RiUser3Line />, label: 'Profile', active: true },
  { icon: <FiShoppingBag />, label: 'Orders' },
  { icon: <FiHeart />, label: 'Wishlist' },
  { icon: <FiMapPin />, label: 'Addresses' },
  { icon: <FiSettings />, label: 'Settings' },
];

const Account = () => {
  const [user, setUser] = useState<User | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.error('No token found, redirecting to login');
        window.location.href = '/auth/form';
        return;
      }

      try {
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
      } catch (error) {
        console.error('Error fetching profile:', error);
        localStorage.removeItem('token');
        window.location.href = '/auth/form';
      }
    };

    fetchProfile();
  }, [token]);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/auth/form';
  };

  if (!user)
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        Loading profile...
      </div>
    );

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
              key={item.label}
              href="#"
              className={`account-nav-item ${item.active ? 'active' : ''}`}
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
        {/* Personal Info */}
        <div className="account-section">
          <div className="account-section-header">
            <h2>Personal Information</h2>
            <button className="account-edit-btn">Edit</button>
          </div>
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
              <span>+212 6 64 79 87 03</span>
            </div>
            <div className="account-info-field">
              <label>City</label>
              <span>Casablanca</span>
            </div>
            <div className="account-info-field">
              <label>Member Since</label>
              <span>
                {new Date(user?.createdAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="account-section">
          <div className="account-section-header">
            <h2>Recent Orders</h2>
          </div>
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <p className="order-id">{order.id}</p>
                    <p className="order-date">{order.date}</p>
                  </div>
                  <span className={`order-status ${order.status}`}>
                    {order.statusLabel}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-thumb">
                      <img src={item.image} alt="order item" />
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span className="order-total">{order.total}</span>
                  <a href="#" className="order-detail-link">
                    View Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
