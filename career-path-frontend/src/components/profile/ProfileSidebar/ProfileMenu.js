import React from 'react';

const ProfileMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: '🔧', label: 'Account Settings', action: () => console.log('Account Settings') },
    { icon: '🔒', label: 'Privacy Settings', action: () => console.log('Privacy Settings') },
    { icon: '📊', label: 'Data Export', action: () => console.log('Data Export') },
    { icon: '❓', label: 'Help & Support', action: () => console.log('Help & Support') },
  ];

  if (!isOpen) return null;

  return (
    <div className="profile-menu">
      <div className="menu-header">
        <h3>Settings</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <ul className="menu-items">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <button onClick={() => { item.action(); onClose(); }}>
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileMenu;