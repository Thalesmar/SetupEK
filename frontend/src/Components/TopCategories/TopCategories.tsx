import './TopCategories.css';
import topCategoriesDat from './TopCategoriesData.ts';

const TopCategories = () => {
  return (
    <section className="top-categories-container">
      <h2 className="top-categories-title">[ Top Categories ]</h2>

      <div className="top-categories-grid">
        {topCategoriesDat.map((category) => (
          <div
            className={`top-category-card ${category.area}`}
            key={category.id}
          >
            <img src={category.image} alt={category.title} loading='lazy' />

            <div className="category-content">
              <h3>{category.title}</h3>

              <div className="category-tags">
                {category.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;
