import './Footer.css';
import { FaInstagram } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
const Footer = () => {
  const stars: string[] = Array(5).fill('★');

  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        <div className="footer-grid">
          <div className="footer-about">
            <p>
              Innoland is Morocco's #1 gaming store. Find the best gear from the
              brands shaping gaming in Morocco, with a premium shopping
              experience built for players who want to perform at their best.
            </p>
            <div className="footer-about-review">
              {stars.map((star) => (
                <span className="about-reviews-stars">{star}</span>
              ))}

              <span className="about-reviews-text">5/5 +20 reviews</span>
            </div>
            <button className="about-reviews-btn">+212 6 64 79 87 03</button>
          </div>
          <div>
            <div className="footer-title">INNOLAND.</div>
            <div className="footer-list">
              <a href="">Who are we?</a>
              <a href="">Our brands</a>
              <a href="">Contact us</a>
            </div>
          </div>

          <div>
            <div className="footer-title">NEED HELP?</div>
            <div className="footer-list">
              <a href="">FAQ</a>
              <a href="">Track my order</a>
              <a href="">Cash on delivery</a>
              <a href="">Contact us</a>
            </div>

            <div className="footer-title sec-footer-list">POLICIES.</div>
            <div className="footer-list">
              <a href="">Blog</a>
              <a href="">Refund Policy</a>
              <a href="">Privacy Policy</a>
            </div>
          </div>

          <div>
            <div className="footer-title">STAY TUNED.</div>
            <p className="footer-para">
              Join our community and get exclusive offers plus the latest gaming
              releases in Morocco.
            </p>

            <div className="footer-about-social">
              <a href="#">
                <FaInstagram />
              </a>
              <a href="">
                <FaFacebookF />
              </a>
              <a href="">
                <FaTiktok />
              </a>
              <a href="">
                <FiMessageCircle />
              </a>
            </div>

            <div className="footer-email-input">
              <input
                className="footer-email"
                type="email"
                placeholder="Enter your email"
              />
              <button>subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-title">
          <p>YOUR GAMING SHOP</p>
        </div>
      </div>

      <div className="footer-privacy-container">
        <div className="footer-privacy-wrapper">
          <a href="#">
            <span>2026c - SetupEK Maroc</span>
          </a>
          <a href="#">
            <span>Refund Policy · Privacy Policy</span>
          </a>
          <a href="#">
            <span>All our products are shipped with love from Morocco</span>
          </a>
        </div>
      </div>

      <div className="copyright">
        <p>Developed by</p>
        <a href="https://thales-2y8.pages.dev/">ThalesMr</a>
      </div>
    </footer>
  );
};

export default Footer;
