import React, { useState, useContext } from 'react';
import { GymContext } from '../context/GymContext';

export default function Trainers({ setActiveSection }) {
  const { trainers, bookPtSession, currentUser, members } = useContext(GymContext);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingDay, setBookingDay] = useState('Monday');
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  const handleOpenBooking = (trainer) => {
    if (currentUser.role === 'guest') {
      alert('Please log in as a Member first to book Personal Trainer sessions. Use the Simulator Bar!');
      setActiveSection('portal');
      return;
    }
    
    // Check if Member has active subscription
    const profile = members.find(m => m.email.toLowerCase() === currentUser.email.toLowerCase());
    if (!profile || !profile.subscription) {
      alert('Active subscription required to book training sessions. Please subscribe to a package first!');
      setActiveSection('pricing');
      return;
    }

    setSelectedTrainer(trainer);
  };

  const handleConfirmBooking = () => {
    if (!selectedTrainer) return;
    const success = bookPtSession(selectedTrainer.id, bookingDay, bookingTime);
    if (success) {
      setSelectedTrainer(null);
    }
  };

  return (
    <section className="section" id="trainers" style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--primary-color)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px', display: 'block', marginBottom: '0.5rem' }}>
            Meet the Pros
          </span>
          <h2>Expert Personal Trainers</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Work 1-on-1 with Kluang's top fitness professionals. Accelerate weight loss, master Muay Thai fight tactics, or scale up your heavy lifts.
          </p>
        </div>

        <div className="grid-3">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="card trainer-card">
              <img 
                src={trainer.photo || '/hero.png'} 
                alt={trainer.name} 
                className="trainer-img" 
              />
              
              <div className="trainer-info">
                <h3 className="trainer-name">{trainer.name}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.4rem 0 1rem 0' }}>
                  {trainer.specialties.map((spec, i) => (
                    <span 
                      key={i} 
                      className="badge badge-primary"
                      style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                
                <p className="trainer-bio">{trainer.bio}</p>

                {currentUser.role === 'admin' || currentUser.role === 'trainer' ? (
                  <button 
                    className="btn btn-secondary" 
                    disabled 
                    style={{ marginTop: 'auto', width: '100%', cursor: 'not-allowed' }}
                  >
                    View Bio Only
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: 'auto', width: '100%' }}
                    onClick={() => handleOpenBooking(trainer)}
                  >
                    Book 1-on-1 Session
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Booking Modal / Bottom Sheet */}
      {selectedTrainer && (
        <div className="modal-overlay" onClick={() => setSelectedTrainer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
              Book PT Session with <span className="text-glow">{selectedTrainer.name}</span>
            </h3>

            <div className="form-group">
              <label>Select Day</label>
              <select 
                className="form-control"
                value={bookingDay}
                onChange={(e) => setBookingDay(e.target.value)}
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Time Slot</label>
              <select 
                className="form-control"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              >
                {times.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', margin: '1rem 0' }}>
              💡 <strong>Booking Terms:</strong> Sessions must be cancelled at least 2 hours before the scheduled time. VIP package users will have 1 session deducted from their remaining credits.
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedTrainer(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
