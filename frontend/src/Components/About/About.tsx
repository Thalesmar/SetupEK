import './About.css';

const aboutItems = [
  {
    title: 'GEAR UP LIKE A PRO GAMER.',
    text: "A unique catalog with the world's top gaming brands: ATK, VXE, FGG, Tangzu and more. Thousands of products picked for performance and quality, now available in Morocco in one place.",
  },

  {
    title: 'TRUST SETUPEK.',
    text: "Shop with Morocco's reference gaming store. SetupEk selects only 100% authentic products sourced directly from official distributors. Every item is checked before shipping to guarantee uncompromising quality.",
  },

  {
    title: 'AN INCREDIBLE EXPERIENCE.',
    text: 'From browsing the site to opening your package, we make every step memorable. Fast delivery across Morocco, real-time tracking, and support available 7 days a week by phone and WhatsApp.',
  },
];

const AboutArea = () => {
  return (
    <section className="about-area-container">
      <div className="about-area-wrapper">
        {aboutItems.map((item) => (
          <div className="about-area" key={item.title}>
            <div className="about-icon">
              <div className="diamond">
                <div className="diamond-inner"></div>
              </div>
            </div>

            <div className="about-text">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutArea;
