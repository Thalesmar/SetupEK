import './Product.css';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
// import allProducts from '../../data/allProducts';
import { CartContext } from '../../context/CartContext';
import { useFavorites } from '../../context/useFavorites';

type Product = {
  id: number;
  title: string;
  brand: string;
  price: string;
  stock: string;
  category: string;
  sku: string;
  description: string;
  images: string[];
  specs: [string, string][];
};

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const cart = useContext(CartContext);
  const { toggleFavorite, isFavorited } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>(
    'desc'
  );
  const [qty, setQty] = useState(1);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/products/${id}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.product) {
          throw new Error('Product data missing in response');
        }
        
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };
    fetchProduct();
  }, [id]);

  if (error) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <p>Make sure the backend server is running on port 8080.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        Loading product...
      </div>
    );
  }

  const isProductFavorited = isFavorited(product.id);

  return (
    <div>
      <div className="product-detail-breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <a href="/shop">{product.category}</a>
        <span>›</span>
        <span>{product.title}</span>
      </div>

      <div className="product-detail-layout">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="product-main-img">
            <img src={product.images[activeThumb]} alt={product.title} />
          </div>
          <div className="product-thumbnails">
            {product.images.map((t, i) => (
              <div
                key={i}
                className={`product-thumb ${activeThumb === i ? 'active' : ''}`}
                onClick={() => setActiveThumb(i)}
              >
                <img src={t} alt={`View ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <p className="product-info-brand">{product.brand}</p>
          <h1 className="product-info-title">{product.title}</h1>
          <p className="product-info-price">{product.price}</p>
          <span className="product-info-stock">✓ {product.stock}</span>

          <div className="product-divider" />

          <div className="product-qty-row">
            <div className="product-qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button
              className="product-add-cart"
              onClick={() => product && cart?.addToCart(product, qty)}
            >
              Add to Cart
            </button>
            <button
              className="product-wishlist"
              onClick={() => product && toggleFavorite(product.id)}
            >
              {isProductFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
            </button>
          </div>

          <div className="product-divider" />

          <div className="product-meta">
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Delivery:</strong> 1–3 business days across Morocco
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs-section">
        <div className="product-tabs">
          {(['desc', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              className={`product-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'desc'
                ? 'Description'
                : tab === 'specs'
                  ? 'Specifications'
                  : 'Reviews'}
            </button>
          ))}
        </div>

        <div className="product-tab-content">
          {activeTab === 'desc' && <p>{product.description}</p>}
          {activeTab === 'specs' && (
            <table className="product-specs-table">
              <tbody>
                {product.specs.map(([key, val]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <p>No reviews yet. Be the first to review this product.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
