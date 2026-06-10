import './services.css';
import { FaCreditCard } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import { BiSupport } from "react-icons/bi";


const Services = () => {
  return (
    <section className="services-container">
      <div className="services-wrapper">
        <div className="services-grid">
          <div className='services'>
            <span className='services-icon'><FaCreditCard /></span>
            <span className='services-label'>Cash on delivery</span>
            <span className='services-description'>Pay easily when your order arrives – no upfront payment needed.</span>
          </div>
          <div className='services'>
            <span className='services-icon'><FaBoxOpen /></span>
            <span className='services-label'>We ship the same day</span>
            <span className='services-description'>On weekdays, orders placed before 10 a.m. are shipped the same day.</span>
          </div>
          <div className='services'>
            <span className='services-icon'><MdCurrencyExchange /></span>
            <span className='services-label'>30-day returns</span>
            <span className='services-description'>Enjoy peace of mind — you have 30 days to return or exchange your product.</span>
          </div>
          <div className='services'>
            <span className='services-icon'><BiSupport /></span>
            <span className='services-label'>24H SPEAKING SUPPORT
</span>
            <span className='services-description'>Got a question or need help? We're here 7 days a week at +212 669811762</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
