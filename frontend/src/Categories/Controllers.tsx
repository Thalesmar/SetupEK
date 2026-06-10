import '../pages/Shop/Shop.css';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useState, useContext } from 'react';
import { useProductContext } from '../context/ProductContext';
import { useFavorites } from '../context/useFavorites';
import { CartContext } from '../context/CartContext';

const brands = ['VXE', 'ATK', 'FGG', 'X-Raypad', 'Tangzu'];

const Controllers = () => {
  const { products, loading, error } = useProductContext();
  const { favorites, toggleFavorite } = useFavorites();
  const cart = useContext(CartContext);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('featured');

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const filteredProducts = products
    .filter((p) => p.category === 'Controllers')
    .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .sort((a, b) => {
      if (sortOrder === 'high') return parseInt(b.price) - parseInt(a.price);
      if (sortOrder === 'low') return parseInt(a.price) - parseInt(b.price);
      return 0;
    });

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}><p>{error}</p></div>;

  return (
    <div>
      <div className="products-banner-wrapper">
        <img
          src="/assets/products-banner/Categorie-Banner_Manette-copy.webp"
          className="product-banner"
          alt="Gaming controller"
        />
      </div>
      <div className="shop-breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <span>Controllers</span>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h4>Brand</h4>
            <div className="filter-options">
              {brands.map((b) => (
                <label key={b}>
                  <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => handleBrandChange(b)} />
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
              <label><input type="checkbox" /> In Stock</label>
              <label><input type="checkbox" /> Pre-order</label>
            </div>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-toolbar">
            <p><strong>{filteredProducts.length}</strong> products found</p>
            <div className="shop-sort">
              <span>Sort by:</span>
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="shop-grid">
            {filteredProducts.map((p) => (
              <a href={`/product/${p.id}`} key={p.id} className="shop-card" style={{ textDecoration: 'none' }}>
                <div className="shop-card-img">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <span className="shop-card-badge">{p.discount}</span>
                  <button className="shop-card-fav" onClick={(e) => { e.preventDefault(); toggleFavorite(p.id); }}>
                    {favorites.includes(p.id) ? <MdFavorite /> : <MdFavoriteBorder />}
                  </button>
                </div>
                <div className="shop-card-info">
                  <p className="shop-card-brand">{p.brand}</p>
                  <p className="shop-card-title">{p.title}</p>
                  <div className="shop-card-bottom">
                    <span className="shop-card-price">{p.price}</span>
                    <button className="shop-card-btn" onClick={(e) => { e.preventDefault(); cart?.addToCart({ id: p.id, title: p.title, price: p.price, images: p.images }, 1); }}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="shop-pagination">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={n === 1 ? 'active' : ''}>{n}</button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Controllers;
