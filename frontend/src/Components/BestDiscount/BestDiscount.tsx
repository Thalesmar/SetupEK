import './BestDiscount.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useEffect, useState } from 'react';

const images = [
  { name: 'Headsets', image: '/assets/discount-slide/img-1.webp' },
  { name: 'Mouse', image: '/assets/discount-slide/img-2.jpg' },
  { name: 'Accessories', image: '/assets/discount-slide/img-3.webp' },
  { name: 'Keyboards', image: '/assets/discount-slide/img-4.webp' },

  { name: 'Controllers', image: '/assets/discount-slide/img-5.webp' },

  { name: 'IEM', image: '/assets/discount-slide/img-6.png' },

  { name: 'Mousepads', image: '/assets/discount-slide/img-7.webp' },
];

const BestDiscount = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const maxSlides = 4;
  const maxSliderSize = 344;
  const maxSlideIndex = images.length - maxSlides;

  const handleLeftSlides = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRightSlides = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxSlideIndex));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [maxSlideIndex]);

  return (
    <section className="best-discount-container">
      <div className="best-discount-wrapper">
        <div className="best-discount">
          <button
            onClick={handleLeftSlides}
            className="left-arrow-btn"
            //and we disable leftSlide when we are in index 0
            disabled={currentIndex === 0}
          >
            <IoIosArrowBack />
          </button>

          <div className="best-discount-slider-window">
            <div
              className="best-discount-slider"
              style={{
                transform: `translateX(-${currentIndex * maxSliderSize}px)`,
              }}
            >
              {images.map((img, index) => (
                <a
                  href={`/category/${img.name}`}
                  className="best-discount-slide"
                  key={index}
                >
                  <img
                    src={img.image}
                    alt={`Discount ${img.name}`}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={handleRightSlides}
            className="right-arrow-btn"
            //we disable slide to right when currentIndex equal to last index
            disabled={currentIndex === maxSlideIndex}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestDiscount;
