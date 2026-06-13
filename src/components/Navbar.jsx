import React, { useContext } from 'react';
import { GymContext } from '../context/GymContext';

export default function Navbar({ activeSection, setActiveSection }) {
  const { currentUser, login, logout, gymSettings } = useContext(GymContext);

  const handleSimulateRole = (role, email = '') => {
    if (role === 'guest') {
      logout();
      setActiveSection('home');
    } else {
      let simEmail = email;
      if (role === 'member' && !email) simEmail = 'member@gmail.com';
      if (role === 'trainer' && !email) simEmail = 't2'; // Marcus
      if (role === 'admin' && !email) simEmail = 'admin@modernfitness.com';
      login(simEmail, role);
      setActiveSection('portal');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Our Gym' },
    { id: 'classes', label: 'Timetable' },
    { id: 'pricing', label: 'Memberships' },
    { id: 'trainers', label: 'Trainers' },
    { id: 'portal', label: currentUser.role !== 'guest' ? `${currentUser.role.toUpperCase()} Portal` : 'Join Us' },
  ];

  return (
    <>
      {/* Simulation Bar for Demo purposes */}
      <div className="role-simulator">
        <div className="container simulator-container">
          <div>
            <span>Demo Mode: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
          </div>
          <div className="simulator-actions">
            <span>Switch Role:</span>
            <button 
              className={`simulator-btn ${currentUser.role === 'guest' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('guest')}
            >
              Guest
            </button>
            <button 
              className={`simulator-btn ${currentUser.role === 'member' && currentUser.email === 'member@gmail.com' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('member', 'member@gmail.com')}
            >
              Member (Subscribed)
            </button>
            <button 
              className={`simulator-btn ${currentUser.role === 'member' && currentUser.email === 'guest_member@gmail.com' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('member', 'guest_member@gmail.com')}
            >
              Member (No Sub)
            </button>
            <button 
              className={`simulator-btn ${currentUser.role === 'trainer' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('trainer', 't2')}
            >
              Trainer
            </button>
            <button 
              className={`simulator-btn ${currentUser.role === 'admin' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('admin', 'admin@modernfitness.com')}
            >
              Admin/Manager
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar-header">
        <div className="container nav-container">
          <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); setActiveSection('home'); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary-color)'}}>
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-1-1" />
              <path d="m3 3 1 1" />
              <path d="m18.5 5.5 1.5-1.5" />
              <path d="m5.5 18.5-1.5 1.5" />
              <path d="M8.5 2h7" />
              <path d="M8.5 22h7" />
              <path d="M12 2v20" />
            </svg>
            {gymSettings.name.split(' ').map((word, i) => (
              <span key={i} style={i === 0 ? {color: 'white'} : {color: 'var(--primary-color)'}}>{word} </span>
            ))}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Sticky Bottom Thumb Navigation */}
      <nav className="mobile-nav">
        <a 
          href="#home" 
          className={`mobile-nav-item ${activeSection === 'home' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveSection('home'); }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </a>
        <a 
          href="#classes" 
          className={`mobile-nav-item ${activeSection === 'classes' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveSection('classes'); }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Timetable
        </a>
        <a 
          href="#pricing" 
          className={`mobile-nav-item ${activeSection === 'pricing' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveSection('pricing'); }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pricing
        </a>
        <a 
          href="#portal" 
          className={`mobile-nav-item ${activeSection === 'portal' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveSection('portal'); }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {currentUser.role === 'guest' ? 'Join Us' : currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
        </a>
      </nav>
    </>
  );
}
