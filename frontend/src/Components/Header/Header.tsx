import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import './Header.css';
import { FiShoppingCart } from 'react-icons/fi';
import { RiUser3Line } from 'react-icons/ri';
import { MdFavoriteBorder } from 'react-icons/md';
import { LuSearch } from 'react-icons/lu';
import { GiHamburgerMenu } from 'react-icons/gi';
import navCategories from '../../data/navCategories.ts';
import BrandsData from '../Brands/BrandsData.ts';
import { CartContext } from '../../context/CartContext.tsx';
import { useProductContext } from '../../context/ProductContext.tsx';

const navToProductCategory: Record<string, string> = {
  Mouse: 'Mouses',
  IEM: 'IEMs',
};

const Header = () => {
  const { products } = useProductContext();
  const [languageBtn, setLanguageBtn] = useState<string>('EN');
  const [isLogin, setIsLogin] = useState<boolean>(
    () => !!localStorage.getItem('token')
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const cart = useContext(CartContext);
  const cartCount = cart?.cartCount ?? 0;

  const trendingByCategory = useMemo(() => {
    return Object.fromEntries(
      navCategories.map((category) => [
        category.name,
        products
          .filter(
            (p) =>
              p.category ===
              (navToProductCategory[category.name] ?? category.name)
          )
          .slice(0, 2)
          .map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: p.image,
          })),
      ])
    );
  }, [products]);

  const hotDeals = useMemo(
    () => products.filter((p) => p.discount.startsWith('-')),
    [products]
  );
  const newArrivals = useMemo(
    () => products.filter((p) => p.discount === 'New'),
    [products]
  );

  const handleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsLogin(!!token);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('auth-change', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('auth-change', checkLoginStatus);
    };
  }, [checkLoginStatus]);

  return (
    <header className="header-container">
      <div className="top-header">
        <div className="header-logo">
          <a href="/" className="hero-title">
            Setup<span>EK</span>
          </a>
        </div>

        <div className="header-middle">
          <div className="search-wrapper">
            <div className="search-bar">
              <LuSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search for a product, a brand..."
              />
            </div>
          </div>
        </div>

        <div className="language-container">
          <button
            className={languageBtn === 'EN' ? 'active' : ''}
            onClick={() => setLanguageBtn('EN')}
          >
            EN
          </button>

          <button
            className={languageBtn === 'FR' ? 'active' : ''}
            onClick={() => setLanguageBtn('FR')}
          >
            FR
          </button>
        </div>

        <div className="contact-number-container">
          <i className="fa-solid fa-phone"></i>
          <div className="number-text">
            <p>Need help? Call us:</p>
            <span>+212 6 64 79 87 03</span>
          </div>
        </div>

        <div className="user-section">
          <a href={isLogin ? '/auth/Account' : '/auth/form'} className="user">
            <RiUser3Line />
            <span>Account</span>
          </a>

          <a href="/Favorites/Favorites" className="favorite">
            <MdFavoriteBorder />
            <span>Favorites</span>
          </a>

          <a href="/Cart/Cart" className="cart">
            <FiShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
        </div>

        <div className="mobile-icons">
          <a href="/Cart/Cart" className="mobile-icon-btn">
            <FiShoppingCart />
          </a>
          <a href="/Favorites/Favorites" className="mobile-icon-btn">
            <MdFavoriteBorder />
          </a>
          <button
            onClick={handleMobileMenu}
            className="hamburger-icon"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={handleMobileMenu} />
      )}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-search">
          <div className="search-bar">
            <LuSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
            />
          </div>
        </div>

        <div className="mobile-actions">
          <a
            href={isLogin ? '/auth/Account' : '/auth/form'}
            className="mobile-action"
          >
            <RiUser3Line />
            <span>Account</span>
          </a>
          <a href="/Favorites/Favorites" className="mobile-action">
            <MdFavoriteBorder />
            <span>Favorites</span>
          </a>
          <a href="/Cart/Cart" className="mobile-action">
            <FiShoppingCart />
            <span>Cart</span>
          </a>
        </div>

        <div className="mobile-menu-section">
          <h4>Quick links</h4>
          <a href="/shop" className="hot-deal-style">
            HOT DEALS
          </a>
          <a href="/shop" className="new-arr-style">
            New Arrivals
          </a>
          <a href="#">Brands</a>
        </div>

        <div className="mobile-menu-section">
          <h4>Categories</h4>
          {navCategories.map((category) => (
            <a href={`/category/${category.name}`} key={category.name}>
              {category.name}
            </a>
          ))}
        </div>
      </div>

      <hr className="header-divider" />

      <nav className="bottom-header-section">
        <div className="deals-wrapper">
          {/* HOT DEALS mega menu */}
          <div className="nav-item">
            <a href="/shop" className="nav-link hot-deal-style">
              HOT DEALS
            </a>
            <div className="mega-menu">
              <div
                className="mega-container"
                style={{ gridTemplateColumns: '1fr' }}
              >
                <div className="mega-column">
                  <h4>HOT DEALS</h4>
                  <div
                    className="product-grid"
                    style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
                  >
                    {hotDeals.map((p) => (
                      <a
                        href={`/product/${p.id}`}
                        className="product-card"
                        key={p.id}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                        }}
                      >
                        <div className="product-img">
                          <img src={p.image} alt={p.title} />
                        </div>
                        <div className='product-bottom'>
                          <h3>{p.title}</h3>
                          <p>{p.price}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEW ARRIVALS mega menu */}
          <div className="nav-item">
            <a href="/shop" className="nav-link new-arr-style">
              NEW ARRIVALS
            </a>
            <div className="mega-menu">
              <div
                className="mega-container"
                style={{ gridTemplateColumns: '1fr' }}
              >
                <div className="mega-column">
                  <h4>NEW ARRIVALS</h4>
                  <div
                    className="product-grid"
                    style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
                  >
                    {newArrivals.map((p) => (
                      <a
                        href={`/product/${p.id}`}
                        className="product-card"
                        key={p.id}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                        }}
                      >
                        <div className="product-img">
                          <img src={p.image} alt={p.title} />
                        </div>
                        <div className="product-bottom">
                          <h3>{p.title}</h3>
                          <p>{p.price}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="deals-line"></div>

          {navCategories.map((category) => (
            <div className="nav-item" key={category.name}>
              <a href={`/category/${category.name}`} className="nav-link">
                {category.name}
              </a>

              <div className="mega-menu">
                <div className="mega-container">
                  <div className="mega-column filter-column">
                    <h4>FILTER BY</h4>

                    {category.filters.map((filter) => (
                      <button key={filter}>{filter}</button>
                    ))}
                  </div>

                  <div className="mega-column category-column">
                    <h4>{category.name}</h4>

                    <div className="mega-links">
                      {category.links.map((link) => (
                        <a href={`/category/${category.name}`} key={link}>
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mega-column trending-column">
                    <h4>TRENDING</h4>

                    <div className="product-grid">
                      {trendingByCategory[category.name]?.map((p) => (
                        <a
                          href={`/product/${p.id}`}
                          className="product-card"
                          key={p.id}
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'block',
                          }}
                        >
                          <div className="product-img">
                            <img src={p.image} alt={p.name} />
                          </div>
                          <div className="product-bottom">
                            <h3>{p.name}</h3>
                            <p>{p.price}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="deals-line"></div>

          {/* BRANDS mega menu */}
          <div className="nav-item">
            <a href="#" className="nav-link">
              Brands
            </a>
            <div className="mega-menu">
              <div
                className="mega-container"
                style={{ gridTemplateColumns: '1fr' }}
              >
                <div className="mega-column">
                  <h4>OUR BRANDS</h4>
                  <div
                    className="product-grid"
                    style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
                  >
                    {BrandsData.map((b) => (
                      <div
                        className="product-card"
                        key={b.id}
                        style={{ textAlign: 'center' }}
                      >
                        <div className="product-img">
                          <img
                            src={b.brandLogo}
                            alt={b.brandName}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <div className="product-bottom">
                          <h3>{b.brandName}</h3>
                          <p style={{ fontSize: '12px', color: '#888' }}>
                            {b.productCount} products
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
