import './Reviews.css';
import { IoMdStarOutline } from 'react-icons/io';
import reviewsData from './ReviewsData';

const ReviewSection = () => {
  return (
    <section className="reviews-container">
      <div className="reviews-wrapper">
        <div className="review-text">
          <p>WHAT OUR CUSTOMERS SAY</p>
          <h2>RATED EXCELLENT FROM 20+ GOOGLE REVIEWS</h2>
        </div>

        <div className="reviews-cards-wrapper">
          {reviewsData.map((review) => (
            <div className="reviews-cards" key={review.id}>
              <div className="stars">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <i className="stars">
                    <IoMdStarOutline key={index} />
                  </i>
                ))}
              </div>

              <p>{review.review}</p>

              <div className="review-bottom">
                <span>""</span>
                <p>{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ReviewSection;
