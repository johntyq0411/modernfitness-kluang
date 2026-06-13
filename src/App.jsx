import React, { useState, useContext } from 'react';
import { GymProvider, GymContext } from './context/GymContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Classes from './components/Classes';
import Pricing from './components/Pricing';
import Trainers from './components/Trainers';
import MemberDashboard from './components/MemberDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import ConfigPanel from './components/ConfigPanel';
import './App.css';

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const { currentUser, login, gymSettings, members, setMembers } = useContext(GymContext);

  // Local state for portal login/signup forms
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState('member');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handlePortalLogin = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('Please enter your email address to log in.');
      return;
    }
    login(loginEmail, loginRole);
    setActiveSection('portal');
  };

  const handlePortalRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      alert('Please fill in all details.');
      return;
    }

    const emailLower = regEmail.toLowerCase();
    const exists = members.some(m => m.email.toLowerCase() === emailLower);
    
    if (exists) {
      alert('This email is already registered. Switching to Sign In page!');
      setIsRegistering(false);
      setLoginEmail(regEmail);
      return;
    }

    // Register new member profile
    const newMember = {
      email: emailLower,
      name: regName,
      subscription: null,
      trainer: null,
      ptSessionsLeft: 0
    };

    setMembers(prev => [...prev, newMember]);
    login(emailLower, 'member');
    setActiveSection('portal');
    alert(`Account created successfully! Welcome to the gym, ${regName}!`);
  };

  // Render Portal/Dashboard based on user role
  const renderPortal = () => {
    switch (currentUser.role) {
      case 'member':
        return <MemberDashboard setActiveSection={setActiveSection} />;
      case 'trainer':
        return <TrainerDashboard setActiveSection={setActiveSection} />;
      case 'admin':
        return <ConfigPanel setActiveSection={setActiveSection} />;
      default:
        // Guest view of the portal (Sleek login/signup card)
        return (
          <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '480px' }}>
              <div className="card" style={{ padding: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                
                {/* Tabs Selector */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                  <button 
                    type="button"
                    style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: 'none', borderBottom: !isRegistering ? '2px solid var(--primary-color)' : 'none', color: !isRegistering ? 'white' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    onClick={() => setIsRegistering(false)}
                  >
                    Sign In
                  </button>
                  <button 
                    type="button"
                    style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: 'none', borderBottom: isRegistering ? '2px solid var(--primary-color)' : 'none', color: isRegistering ? 'white' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    onClick={() => setIsRegistering(true)}
                  >
                    Create Account
                  </button>
                </div>

                {!isRegistering ? (
                  /* SIGN IN FORM */
                  <form onSubmit={handlePortalLogin}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'white' }}>Welcome Back</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                        Enter your credentials to access your dashboard.
                      </p>
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="e.g. member@gmail.com" 
                        className="form-control" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Account Type</label>
                      <select 
                        className="form-control"
                        value={loginRole}
                        onChange={(e) => setLoginRole(e.target.value)}
                      >
                        <option value="member">Gym Member / Fighter</option>
                        <option value="trainer">Personal Trainer / Coach</option>
                        <option value="admin">Gym Manager / Admin</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', fontWeight: '700' }}>
                      Sign In
                    </button>
                  </form>
                ) : (
                  /* SIGN UP / REGISTER FORM */
                  <form onSubmit={handlePortalRegister}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'white' }}>Start Your Journey</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                        Register today to start booking classes.
                      </p>
                    </div>

                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. John Doe" 
                        className="form-control" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="e.g. johndoe@gmail.com" 
                        className="form-control" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', fontWeight: '700' }}>
                      Create Account
                    </button>
                  </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}>
                  💡 <strong>Quick Demo Tip:</strong> You can also use the horizontal simulator bar at the very top of your screen to switch roles instantly!
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar with embedded role simulator */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Areas */}
      <main style={{ flexGrow: 1 }}>
        {activeSection === 'home' && (
          <>
            <Hero setActiveSection={setActiveSection} />
            <About />
            <Classes setActiveSection={setActiveSection} />
            <Pricing setActiveSection={setActiveSection} />
            <Trainers setActiveSection={setActiveSection} />
          </>
        )}

        {activeSection === 'about' && <About />}

        {activeSection === 'classes' && <Classes setActiveSection={setActiveSection} />}

        {activeSection === 'pricing' && <Pricing setActiveSection={setActiveSection} />}

        {activeSection === 'trainers' && <Trainers setActiveSection={setActiveSection} />}

        {activeSection === 'portal' && renderPortal()}
      </main>

      {/* Footer Area */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo footer-logo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary-color)'}}>
                  <path d="m6.5 6.5 11 11" />
                  <path d="m21 21-1-1" />
                  <path d="m3 3 1 1" />
                  <path d="m18.5 5.5 1.5-1.5" />
                  <path d="m5.5 18.5-1.5 1.5" />
                  <path d="M8.5 2h7" />
                  <path d="M8.5 22h7" />
                  <path d="M12 2v20" />
                </svg>
                <span style={{color: 'white'}}>Modern</span>
                <span style={{color: 'var(--primary-color)'}}>Fitness</span>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
                Kluang's premier strength conditioning and Muay Thai training academy.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a 
                  href="https://www.instagram.com/modernfitness_kluang?igsh=bnJzeWFtMnBvcmE5" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-color)', transition: 'var(--transition-smooth)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'inherit'; }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/share/187VuTJuad/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-color)', transition: 'var(--transition-smooth)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'inherit'; }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Gym Services</h4>
              <ul className="footer-links">
                <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveSection('about'); }}>Gym Facilities</a></li>
                <li><a href="#classes" onClick={(e) => { e.preventDefault(); setActiveSection('classes'); }}>Muay Thai Arena</a></li>
                <li><a href="#classes" onClick={(e) => { e.preventDefault(); setActiveSection('classes'); }}>Group Classes</a></li>
                <li><a href="#trainers" onClick={(e) => { e.preventDefault(); setActiveSection('trainers'); }}>Personal Training</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact & Support</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                📍 {gymSettings.address}<br />
                📞 Phone: {gymSettings.phone}<br />
                ⏰ Hours: {gymSettings.operatingHours}
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {gymSettings.name}. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <a href="#home" onClick={(e) => { e.preventDefault(); setActiveSection('home'); }}>Back to Top</a>
              <span>&middot;</span>
              <a href="#portal" onClick={(e) => { e.preventDefault(); setActiveSection('portal'); }}>Staff Login</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
}
