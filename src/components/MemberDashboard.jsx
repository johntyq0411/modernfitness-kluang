import React, { useContext } from 'react';
import { GymContext } from '../context/GymContext';

export default function MemberDashboard({ setActiveSection }) {
  const { 
    currentUser, 
    members, 
    timetable, 
    cancelClassBooking, 
    ptBookings, 
    cancelPtBooking,
    logout
  } = useContext(GymContext);

  // Find member profile details
  const profile = members.find(m => m.email.toLowerCase() === currentUser.email.toLowerCase()) || {
    email: currentUser.email,
    name: currentUser.name,
    subscription: null,
    trainer: null,
    ptSessionsLeft: 0
  };

  // Find classes the user has enrolled in
  const bookedClasses = timetable.filter(c => c.enrolled.includes(currentUser.email));

  // Find PT bookings for this user
  const userPtBookings = ptBookings.filter(b => b.memberEmail.toLowerCase() === currentUser.email.toLowerCase());

  return (
    <div className="section" style={{ minHeight: '70vh' }}>
      <div className="container">
        
        {/* Profile Info Header */}
        <div className="portal-header">
          <div className="profile-card-details">
            <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
              Welcome Back
            </span>
            <h3>{profile.name}</h3>
            <p>📧 {profile.email}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="subscription-status-badge">
              {profile.subscription ? (
                <span>⚡ Membership: <strong>{profile.subscription}</strong></span>
              ) : (
                <span style={{ color: '#ef4444' }}>⚠️ No Active Subscription</span>
              )}
            </div>
            
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', borderRadius: '0.75rem' }}
              onClick={() => { logout(); setActiveSection('home'); }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Action Suggestion if No Subscription */}
        {!profile.subscription && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px dashed #ef4444', borderRadius: '1rem', padding: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Start Training Today!</h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              You need an active subscription pass to book group training classes and lock in personal coaching hours.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveSection('pricing')}>
              Browse Subscription Plans
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          
          {/* Class Bookings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>My Booked Classes</h3>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                onClick={() => setActiveSection('classes')}
              >
                + Book New
              </button>
            </div>

            {bookedClasses.length > 0 ? (
              <div className="list-table-container">
                <table className="list-table">
                  <thead>
                    <tr>
                      <th>Class Details</th>
                      <th>Schedule</th>
                      <th>Room</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedClasses.map(c => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Coach: {c.trainer}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{c.day}</span>
                          <span style={{ display: 'block', fontSize: '0.8rem', marginTop: '0.2rem' }}>{c.time.split(' - ')[0]}</span>
                        </td>
                        <td>{c.room}</td>
                        <td>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => cancelClassBooking(c.id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>You haven't reserved any group classes for this week.</p>
              </div>
            )}
          </div>

          {/* Personal Trainer Bookings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>1-on-1 PT Sessions</h3>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                onClick={() => setActiveSection('trainers')}
              >
                + Schedule PT
              </button>
            </div>

            {/* Coach Assignment info */}
            {profile.subscription && profile.subscription.includes('VIP') && (
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Assigned Coach</span>
                  <h4 style={{ color: 'white', fontSize: '1.1rem', marginTop: '0.1rem' }}>{profile.trainer || 'Assigning soon...'}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>PT Balance</span>
                  <h4 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', marginTop: '0.1rem' }}>{profile.ptSessionsLeft} Sessions</h4>
                </div>
              </div>
            )}

            {userPtBookings.length > 0 ? (
              <div className="list-table-container">
                <table className="list-table">
                  <thead>
                    <tr>
                      <th>Trainer</th>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPtBookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.trainerName}</strong>
                        </td>
                        <td>{b.day}</td>
                        <td>{b.time}</td>
                        <td>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => cancelPtBooking(b.id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No personal training sessions scheduled.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
