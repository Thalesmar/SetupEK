import './Brands.css';
import BrandsData from './BrandsData.ts';

const OurBrands = () => {
  return (
    <section className="brands-container">
      <div className="brands-top-area">
        <h3>[ Our brands ]</h3>
        <a href="#">View all</a>
      </div>

      <div className="brands-cards-wrapper">
        {BrandsData.map((brand) => (
          <div key={brand.id} className="brands-cards">
            <a href="#">
              <div className="brands-banner">
                <img
                  src={brand.brandBanner}
                  alt={brand.brandName}
                  loading="lazy"
                />
                <span className="product-count">
                  {brand.productCount}
                  <p>products</p>
                </span>
              </div>
            </a>
            <div className="brands-cards-bottom">
              <a href="#" className="brand-logo-wrapper">
                <img
                  src={brand.brandLogo}
                  className="brand-logo"
                  alt={brand.brandName}
                  loading="lazy"
                />
              </a>

              <div className="brands-name">
                <p className="brands-name-title">{brand.brandName}</p>
                <p className="brands-subtitle">Gaming Gear</p>
              </div>
            </div>
            <div className='brands-button-container'>
            <button className='brands-button'>Shop the brand</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurBrands;
