import './InfiniteSlider.css';
import { useState, useEffect } from 'react';

const InfiniteSlider = () => {
  const [position, setPosition] = useState<number>(0);

  const tags: string[] = Array(14).fill('#BACKTOGRIND');
  const resetPosition: number = tags.length * 120;
  const intervalTime: number = 16;
  const duplicatedTags: string[] = [...tags, ...tags];

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= resetPosition) {
          return 0;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [resetPosition]);

  return (
    <section className="infinite-slider-container">
      <div
        className="infinite-slider"
        style={{ transform: `translateX(-${position}px)` }}
      >
        {duplicatedTags.map((tag, index) => (
          <span
            key={index}
            className={index % 2 === 0 ? 'tag black' : 'tag white'}
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};
export default InfiniteSlider;
