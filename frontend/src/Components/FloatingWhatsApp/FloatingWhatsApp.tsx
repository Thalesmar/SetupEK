import './FloatingWhatsApp.css';
import { FiMessageCircle } from 'react-icons/fi';

const FloatingWhatsApp = () => {
  return (
    <a href="https://wa.me/0664798703" target='_blank' className="floating-whatsApp-btn">
      <FiMessageCircle />
    </a>
  );
};

export default FloatingWhatsApp;
