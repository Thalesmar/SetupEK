import './Fvorites.css';
import { useContext } from 'react';
import { MdFavorite } from 'react-icons/md';
import { useFavorites } from '../../context/useFavorites';
import { CartContext } from '../../context/CartContext';
import { useProductContext } from '../../context/ProductContext';

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const cart = useContext(CartContext);
  const { products, loading } = useProductContext();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>Wishlist</h1>
        </div>
        <div className="favorites-empty">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>Wishlist <span className="favorites-count">0 items</span></h1>
        </div>
        <div className="favorites-empty">
          <h2>YOUR WISHLIST IS EMPTY</h2>
          <p>Save products you love by clicking the heart icon.</p>
          <a href="/shop">Browse Shop</a>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Wishlist <span className="favorites-count">{favoriteProducts.length} items</span></h1>
        <button className="favorites-clear" onClick={() => favoriteProducts.forEach(p => toggleFavorite(p.id))}>
          Clear all
        </button>
      </div>

      <div className="favorites-grid">
        {favoriteProducts.map((item) => (
          <div key={item.id} className="favorites-card">
            <div className="favorites-card-img">
              <a href={`/product/${item.id}`}>
                <img src={item.image} alt={item.title} loading="lazy" />
              </a>
              <span className="favorites-card-badge">{item.discount}</span>
              <button className="favorites-remove" onClick={() => toggleFavorite(item.id)}>
                <MdFavorite />
              </button>
            </div>
            <div className="favorites-card-info">
              <p className="favorites-card-brand">{item.brand}</p>
              <p className="favorites-card-title">{item.title}</p>
              <div className="favorites-card-bottom">
                <span className="favorites-card-price">{item.price}</span>
                <button
                  className="favorites-add-btn"
                  onClick={() => cart?.addToCart({ id: item.id, title: item.title, price: item.price, images: item.images }, 1)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
