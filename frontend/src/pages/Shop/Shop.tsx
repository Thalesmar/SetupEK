import './Shop.css';
import { useState } from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useProductContext } from '../../context/ProductContext';
import { useFavorites } from '../../context/useFavorites';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const brands = ['VXE', 'ATK', 'FGG', 'X-Raypad', 'Tangzu'];

export const Shop = () => {
  const { products, loading, error } = useProductContext();
  const { favorites, toggleFavorite } = useFavorites();
  const cart = useContext(CartContext);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('featured');

  const categories = [...new Set(products.map((p) => p.category))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filtered = products
    .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.category))
    .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter((p) => selectedAvailability.length === 0 || selectedAvailability.includes(p.stock))
    .sort((a, b) => {
      if (sortOrder === 'low') return parseInt(a.price) - parseInt(b.price);
      if (sortOrder === 'high') return parseInt(b.price) - parseInt(a.price);
      return 0;
    });

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>
        <h2>Error loading products</h2>
        <p>{error}</p>
        <p>Make sure the backend server is running on port 8080.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="shop-breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <span>Shop</span>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h4>Categories</h4>
            <div className="filter-options">
              {categories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h4>Brand</h4>
            <div className="filter-options">
              {brands.map((b) => (
                <label key={b}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => handleBrandChange(b)}
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h4>Price Range (MAD)</h4>
            <div className="price-range">
              <input type="number" placeholder="Min" />
              <input type="number" placeholder="Max" />
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h4>Availability</h4>
            <div className="filter-options">
              <label>
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes('In stock')}
                  onChange={() => handleAvailabilityChange('In stock')}
                />
                In Stock
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes('Pre-order')}
                  onChange={() => handleAvailabilityChange('Pre-order')}
                />
                Pre-order
              </label>
            </div>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-toolbar">
            <p>
              <strong>{filtered.length}</strong> products found
            </p>
            <div className="shop-sort">
              <span>Sort by:</span>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="shop-grid">
            {filtered.map((p) => (
              <a
                href={`/product/${p.id}`}
                key={p.id}
                className="shop-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="shop-card-img">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <span className="shop-card-badge">{p.discount}</span>
                  <button
                    className="shop-card-fav"
                    onClick={(e) => { e.preventDefault(); toggleFavorite(p.id); }}
                  >
                    {favorites.includes(p.id) ? <MdFavorite /> : <MdFavoriteBorder />}
                  </button>
                </div>
                <div className="shop-card-info">
                  <p className="shop-card-brand">{p.brand}</p>
                  <p className="shop-card-title">{p.title}</p>
                  <div className="shop-card-bottom">
                    <span className="shop-card-price">{p.price}</span>
                    <button
                      className="shop-card-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        cart?.addToCart({ id: p.id, title: p.title, price: p.price, images: p.images }, 1);
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="shop-pagination">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={n === 1 ? 'active' : ''}>
                {n}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
