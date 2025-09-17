import React from 'react';

const Navigation = ({ mobile = false, onLinkClick }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (onLinkClick) onLinkClick();
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonials', label: 'Testimonials' }
  ];

  return (
    <nav className={`navigation ${mobile ? 'mobile' : 'desktop'}`}>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <button
              onClick={() => scrollToSection(item.id)}
              className="nav-link"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;