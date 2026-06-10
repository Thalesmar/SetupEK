import './Setups.css';
import images from './SetupsData';

const bestSetups = () => {
  return (
    <section className="images-line-container">
      <div className="images-line-wrapper">
        {images.map((img) => (
          <div className="images-line" key={img.id}>
            <img src={img.imgSrc} alt={img.imgTitle} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default bestSetups;