import FloatingLines from './FloatingLines.tsx';
import { FiArrowRight } from 'react-icons/fi';
import './secHero.css';

const SecHero = () => {
  return (
    <section className="sec-hero">
      <FloatingLines
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={[10, 6, 10]}
        lineDistance={[7, 5, 7]}
        topWavePosition={{ x: 1.2, y: 0.6, rotate: -0.45 }}
        middleWavePosition={{ x: 0.4, y: 0.15, rotate: 0.15 }}
        bottomWavePosition={{ x: 1.8, y: -0.6, rotate: -0.8 }}
        bendRadius={6}
        bendStrength={-1.35}
        interactive
        parallax
        animationSpeed={0.45}
        linesGradient={['#006bff', '#6f6f6f', '#6a6a6a']}
        mixBlendMode="screen"
      />

      <div className="sec-hero-content">
        <div className="sec-hero-badge" aria-label="New shipment announcement">
          <span>NEW</span>
          <strong>Fresh gear just landed</strong>
        </div>

        <h2>Build Your Ultimate Gaming Setup.</h2>

        <div className="sec-hero-actions">
          <button className="sec-hero-primary" type="button">
            <a href='/shop'>Shop now</a>
            <FiArrowRight />
          </button>

          <button className="sec-hero-secondary" type="button">
            <a href='/brand'>Explore brands</a>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecHero;
