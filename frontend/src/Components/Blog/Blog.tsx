import './Blog.css';
import BlogData from './BlogData';

const SetupEkBlog = () => {
  return (
    <section className="blog-section">
      <div className="blog-top-area">
        <h3>THE INNOLAND BLOG</h3>
        <a href="#">View all articles →</a>
      </div>

      <div className="blog-cards-wrapper">
        {BlogData.map((blog) => (
          <article key={blog.id} className="blog-card">
            <a href="#">
              <div className="blog-banner">
                <img src={blog.image} alt={blog.title} loading="lazy" />
              </div>
            </a>
            <div className="blog-cards-middle">
              <div className='blog-tag-update'>
                <span>{blog.tag}</span>
                <p>{blog.update}</p>
              </div>
              <div className="blog-text">
                <p className="blog-title">{blog.title}</p>
                <p className="blog-description">{blog.description}</p>
              </div>
            </div>
            <div className="blog-cards-button">
              <span>{blog.date}</span>
              <a href="#" className="blog-more">
                Read more →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SetupEkBlog;
