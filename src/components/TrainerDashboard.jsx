import React, { useState, useContext } from 'react';
import { GymContext } from '../context/GymContext';

export default function TrainerDashboard({ setActiveSection }) {
  const { trainers, members, ptBookings, cancelPtBooking, currentUser, login, logout } = useContext(GymContext);

  // Identify active trainer details from currentUser
  // In the simulator, currentUser.email holds the trainer's ID (e.g. t1, t2, t3)
  const activeTrainerId = currentUser.email.startsWith('t') ? currentUser.email : 't2';
  const activeTrainer = trainers.find(t => t.id === activeTrainerId) || trainers[1];

  // Handler to switch simulated trainer
  const handleTrainerChange = (e) => {
    const targetId = e.target.value;
    const coach = trainers.find(t => t.id === targetId);
    if (coach) {
      // Re-login as the chosen trainer
      login(coach.id, 'trainer');
    }
  };

  // Find members signed up under this trainer
  // Match members where trainer name contains the active trainer's name
  const assignedMembers = members.filter(m => 
    m.trainer && m.trainer.toLowerCase().includes(activeTrainer.name.toLowerCase())
  );

  // Find PT bookings scheduled with this trainer
  const scheduledSessions = ptBookings.filter(b => b.trainerId === activeTrainer.id);

  return (
    <div className="section" style={{ minHeight: '70vh' }}>
      <div className="container">
        
        {/* Portal Header */}
        <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
              Trainer Dashboard Portal
            </span>
            <h3>{activeTrainer.name}</h3>
            <p>📋 Specialties: {activeTrainer.specialties.join(', ')}</p>
          </div>
          
          {/* Trainer Switcher and Logout for demo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'var(--bg-dark)', padding: '0.8rem 1.2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                Simulate Coach:
              </label>
              <select 
                className="form-control" 
                value={activeTrainer.id}
                onChange={handleTrainerChange}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-card)', border: 'none', minWidth: '180px' }}
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', borderRadius: '0.75rem', height: 'fit-content' }}
              onClick={() => { logout(); setActiveSection('home'); }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          
          {/* Members signed under packages */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
              Members Under My Package ({assignedMembers.length})
            </h3>
            
            {assignedMembers.length > 0 ? (
              <div className="list-table-container">
                <table className="list-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Membership Plan</th>
                      <th>PT Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedMembers.map((member, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{member.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {member.email}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                            {member.subscription}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: member.ptSessionsLeft > 0 ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                            {member.ptSessionsLeft} Left
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '3.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No members are currently signed under your package.</p>
              </div>
            )}
          </div>

          {/* PT Bookings Scheduled */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
              My Scheduled PT Sessions ({scheduledSessions.length})
            </h3>

            {scheduledSessions.length > 0 ? (
              <div className="list-table-container">
                <table className="list-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Day</th>
                      <th>Time Slot</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledSessions.map(session => (
                      <tr key={session.id}>
                        <td>
                          <strong>{session.memberName}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {session.memberEmail}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{session.day}</span>
                        </td>
                        <td><strong>{session.time}</strong></td>
                        <td>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => cancelPtBooking(session.id)}
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
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '3.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No PT sessions scheduled for this week.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
