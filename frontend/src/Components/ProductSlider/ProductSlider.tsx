import { useRef, useContext } from 'react';
import { MdFavoriteBorder } from 'react-icons/md';
import { MdOutlineFavorite } from 'react-icons/md';
import './ProductSlider.css';
import { CartContext } from '../../context/CartContext';
import { useFavorites } from '../../context/useFavorites';
import { ProductContext } from '../../context/ProductContext';

interface ProductSliderProps {
  title: string;
  type: 'hot-deals' | 'new-arrivals';
}

const ProductSlider = ({ title, type }: ProductSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const productCtx = useContext(ProductContext);
  const cart = useContext(CartContext);
  const { favorites, toggleFavorite } = useFavorites();

  if (!productCtx) return null;

  const { products } = productCtx;

  const filteredProducts = products.filter((p) => {
    if (type === 'hot-deals') return p.discount.startsWith('-');
    if (type === 'new-arrivals') return p.discount === 'New';
    return true;
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    dragStateRef.current.isDown = true;
    dragStateRef.current.startX = e.pageX - sliderRef.current.offsetLeft;
    dragStateRef.current.scrollLeft = sliderRef.current.scrollLeft;
  };

  const stopDrag = () => {
    dragStateRef.current.isDown = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown || !sliderRef.current) return;

    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragStateRef.current.startX) * 1.5;

    sliderRef.current.scrollLeft = dragStateRef.current.scrollLeft - walk;
  };

  return (
    <section className="hot-deals-container">
      <div className="hot-deals-wrapper">
        <div className="hot-deals-label">
          <div className="hot-deals-label-title">
            <div className="hot-deals-label-line"></div>
            <h2>{title}</h2>
          </div>

          <a href="/shop" className="view-all">
            View all →
          </a>
        </div>

        <div
          ref={sliderRef}
          className="hot-deals-products-container"
          onMouseDown={handleMouseDown}
          onMouseLeave={stopDrag}
          onMouseUp={stopDrag}
          onMouseMove={handleMouseMove}
        >
          {filteredProducts.map((product) => (
            <div className="hot-deals-products-wrapper" key={product.id}>
              <div className="hot-deals-products">
                <div className="hot-deals-top">
                  <div className="hot-deals-top-buttons">
                    <span className="hot-deals-discount">
                      {product.discount}
                    </span>

                    <button
                      className="hot-deals-favorite"
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {favorites.includes(product.id) ? (
                        <MdOutlineFavorite />
                      ) : (
                        <MdFavoriteBorder />
                      )}
                    </button>
                  </div>

                  <a href={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      className="hot-deals-img"
                      alt={product.title}
                      loading="lazy"
                      draggable="false"
                    />
                  </a>
                </div>

                <div className="hot-deals-info">
                  <span className="hot-deals-brand">{product.brand}</span>
                  <h3>{product.title}</h3>
                  <span className="hot-deals-stock">
                    {product.stock === 'Pre-order'
                      ? 'Pre-order'
                      : product.inStock
                      ? 'In Stock'
                      : 'Out of stock'}
                  </span>
                  <p>{product.price}</p>
                </div>

                <button
                  className="hot-deals-cart-btn"
                  type="button"
                  disabled={!product.inStock}
                  onClick={() =>
                    cart?.addToCart(
                      {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        images: product.images || [product.image],
                      },
                      1
                    )
                  }
                >
                  {product.inStock ? 'Add to cart' : 'Out of stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
