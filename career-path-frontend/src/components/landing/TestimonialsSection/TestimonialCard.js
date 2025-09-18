import React from 'react';

const TestimonialCard = ({ testimonial, index }) => {
  const renderStars = (rating) => {
    return Array(rating).fill().map((_, i) => (
      <span key={i} className="star">⭐</span>
    ));
  };

  return (
    <div className={`testimonial-card ${index % 2 === 1 ? 'highlighted' : ''}`}>
      <div className="testimonial-rating">
        {renderStars(testimonial.rating)}
      </div>
      <p className="testimonial-text">"{testimonial.text}"</p>
      <div className="testimonial-author">
        <div className="author-avatar">{testimonial.image}</div>
        <div className="author-info">
          <h4 className="author-name">{testimonial.name}</h4>
          <p className="author-role">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;