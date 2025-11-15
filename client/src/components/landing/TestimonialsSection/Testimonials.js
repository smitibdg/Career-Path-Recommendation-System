import React from 'react';
import './Testimonials.css';

const TestimonialsSection = () => {
  // Testimonial data array
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Tech Corp",
      text: "This platform helped me discover my true passion for software development. The career recommendations were spot-on and guided me to my dream job!",
      avatar: "PS",
      rating: 5
    },
    {
      id: 2,
      name: "Rahul Kumar",
      role: "Data Scientist",
      company: "Analytics Inc",
      text: "The personality and skills assessments were incredibly detailed. I found my perfect career match in data science within just 2 weeks of using this platform.",
      avatar: "RK",
      rating: 5
    },
    {
      id: 3,
      name: "Sneha Patel",
      role: "Digital Marketing Manager",
      company: "Creative Agency",
      text: "Amazing career guidance! The AI recommendations opened my eyes to marketing opportunities I never considered. Highly recommend this to all students.",
      avatar: "SP",
      rating: 5
    }
  ];

  // Stats data array
  const stats = [
    {
      number: "10,000+",
      label: "Students Helped"
    },
    {
      number: "95%",
      label: "Success Rate"
    },
    {
      number: "500+",
      label: "Career Paths"
    },
    {
      number: "50+",
      label: "Partner Companies"
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        {/* Section Header */}
        <div className="testimonials-header">
          <h2>What Students Say About Us</h2>
          <p>
            Discover how our AI-powered career recommendation system has helped 
            thousands of students find their perfect career path and achieve their dreams.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              {/* Star Rating */}
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <span key={index} className="star">⭐</span>
                ))}
              </div>
              
              {/* Testimonial Text */}
              <div className="testimonial-text">
                <p>"{testimonial.text}"</p>
              </div>
              
              {/* Author Info */}
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.avatar}
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                  <span className="company">{testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stats */}
        <div className="testimonials-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;