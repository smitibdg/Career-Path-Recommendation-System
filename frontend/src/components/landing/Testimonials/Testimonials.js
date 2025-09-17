import React from 'react';
import TestimonialCard from './TestimonialCard';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Engineering Student',
      image: '👩‍🎓',
      rating: 5,
      text: 'This platform completely changed my perspective about my career. I was confused between engineering and design, but the assessment clearly showed my strengths in creative problem-solving. Now I\'m pursuing UX Design and loving it!'
    },
    {
      name: 'Rahul Kumar',
      role: 'Commerce Graduate',
      image: '👨‍💼',
      rating: 5,
      text: 'I always thought I had to become a CA because of family pressure, but this system revealed my natural aptitude for digital marketing. The career resources helped me land my dream job at a startup!'
    },
    {
      name: 'Anitha Reddy',
      role: 'Science Student',
      image: '👩‍🔬',
      rating: 5,
      text: 'The personality and cognitive tests were so detailed and accurate. They recommended biotechnology research, which I had never considered. Now I\'m doing my PhD and couldn\'t be happier with my choice!'
    },
    {
      name: 'Arjun Patel',
      role: 'Arts Student',
      image: '🎨',
      rating: 5,
      text: 'Being from an arts background, I felt limited in career options. This platform opened my eyes to careers in content strategy, creative writing, and media production. The learning resources were incredibly helpful!'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2>What Our Students Say</h2>
          <p>
            Join thousands of students who have discovered their perfect career path 
            through our comprehensive assessment system.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>

        <div className="testimonials-stats">
          <div className="stat">
            <span className="stat-number">98%</span>
            <span className="stat-label">Student Satisfaction</span>
          </div>
          <div className="stat">
            <span className="stat-number">15,000+</span>
            <span className="stat-label">Successful Placements</span>
          </div>
          <div className="stat">
            <span className="stat-number">4.9/5</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Career Paths</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;