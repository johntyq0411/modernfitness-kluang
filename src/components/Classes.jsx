import React, { useState, useContext } from 'react';
import { GymContext } from '../context/GymContext';

export default function Classes({ setActiveSection }) {
  const { timetable, bookClass, currentUser } = useContext(GymContext);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [searchQuery, setSearchQuery] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filter timetable by day and search query (matches name or trainer)
  const filteredClasses = timetable.filter(c => 
    c.day === selectedDay &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.trainer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBook = (classId) => {
    if (currentUser.role === 'guest') {
      alert('Please register or sign in as a Member to book your free trial class! You can also use the simulator bar at the top of the screen to switch roles.');
      setActiveSection('portal');
      return;
    }
    bookClass(classId);
  };

  return (
    <section className="section" id="classes" style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="container">
        
        <div className="timetable-header">
          <div>
            <span style={{ color: 'var(--primary-color)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px', display: 'block', marginBottom: '0.5rem' }}>
              Weekly Timetable
            </span>
            <h2>Group Fitness Classes</h2>
          </div>
          
          <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search class or coach..." 
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <svg 
              style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} 
              width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="day-tabs">
          {days.map(day => (
            <button 
              key={day}
              className={`day-tab ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Classes List */}
        {filteredClasses.length > 0 ? (
          <div className="class-grid" style={{ marginTop: '2rem' }}>
            {filteredClasses.map(c => {
              const spotsLeft = c.capacity - c.enrolled.length;
              const percentFull = (c.enrolled.length / c.capacity) * 100;
              const isEnrolled = currentUser.role === 'member' && c.enrolled.includes(currentUser.email);

              return (
                <div key={c.id} className="class-card">
                  <div className="class-time">{c.time}</div>
                  <h3 className="class-title">{c.name}</h3>
                  
                  <div className="class-meta">
                    <span>🥋 <strong>Coach:</strong> {c.trainer}</span>
                    <span>📍 <strong>Location:</strong> {c.room}</span>
                  </div>

                  {/* Enrollment Progress Bar */}
                  <div style={{ margin: '1rem 0 0.5rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', fontWeight: '500' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Capacity Booking</span>
                      <span>{c.enrolled.length} / {c.capacity} Slots</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percentFull}%`, 
                          height: '100%', 
                          backgroundColor: percentFull >= 100 ? '#ef4444' : 'var(--primary-color)',
                          boxShadow: percentFull < 100 ? '0 0 8px var(--primary-color)' : 'none',
                          transition: 'width 0.4s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="class-spots">
                    {spotsLeft <= 0 ? (
                      <span className="spots-left">⚠️ Full Capacity</span>
                    ) : spotsLeft <= 3 ? (
                      <span className="spots-left">🔥 Only {spotsLeft} slots left!</span>
                    ) : (
                      <span className="spots-ok">✅ {spotsLeft} slots available</span>
                    )}
                  </div>

                  {/* Contextual Action Buttons */}
                  {currentUser.role === 'admin' || currentUser.role === 'trainer' ? (
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                      <strong style={{ color: 'white', display: 'block', marginBottom: '0.3rem' }}>Enrolled Members:</strong>
                      {c.enrolled.length > 0 ? (
                        <ul style={{ listStyle: 'none', paddingLeft: 0, color: 'var(--text-secondary)' }}>
                          {c.enrolled.map((email, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--primary-color)', borderRadius: '50%' }}></span>
                              {email}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No members booked yet</span>
                      )}
                    </div>
                  ) : (
                    <button
                      className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ marginTop: 'auto', width: '100%' }}
                      onClick={() => handleBook(c.id)}
                      disabled={spotsLeft <= 0 && !isEnrolled}
                    >
                      {isEnrolled ? (
                        <>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          Booked
                        </>
                      ) : spotsLeft <= 0 ? (
                        'Class Full'
                      ) : (
                        currentUser.role === 'guest' ? 'Book Trial Class' : 'Book Session'
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: '1rem', opacity: '0.5' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <p>No group fitness classes scheduled for {selectedDay}.</p>
          </div>
        )}

      </div>
    </section>
  );
}
