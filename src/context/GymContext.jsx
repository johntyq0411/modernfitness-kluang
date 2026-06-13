import React, { createContext, useState, useEffect } from 'react';

// Create Gym Context
export const GymContext = createContext();

// Theme options that can be applied to CSS variables
export const THEMES = {
  lime: {
    name: 'Neon Lime',
    primary: '#a3e635', // Tailwind lime-400
    primaryGlow: 'rgba(163, 230, 53, 0.15)',
    primaryDark: '#84cc16',
  },
  orange: {
    name: 'Volcano Orange',
    primary: '#f97316', // Tailwind orange-500
    primaryGlow: 'rgba(249, 115, 22, 0.15)',
    primaryDark: '#ea580c',
  },
  pink: {
    name: 'Cyber Pink',
    primary: '#ec4899', // Tailwind pink-500
    primaryGlow: 'rgba(236, 72, 153, 0.15)',
    primaryDark: '#db2777',
  },
  cyan: {
    name: 'Electric Cyan',
    primary: '#06b6d4', // Tailwind cyan-500
    primaryGlow: 'rgba(6, 182, 212, 0.15)',
    primaryDark: '#0891b2',
  }
};

// Initial Seed Data
const DEFAULT_GYM_SETTINGS = {
  name: 'Modern Fitness Kluang',
  address: 'No. 2, Jalan Duku, Kampung Masjid Lama, 86000 Kluang, Johor, Malaysia',
  phone: '+60 17-709 9629',
  email: 'info@modernfitnesskluang.com',
  operatingHours: 'Daily: 7:00 AM - 10:30 PM',
  theme: 'lime',
  currency: 'RM',
  description: 'Welcome to Kluang\'s premier fitness training hub. Whether you are aiming to build raw strength, torch calories, or master the ancient art of Muay Thai, our world-class coaches and state-of-the-art facilities are here to unleash your peak potential.'
};

const DEFAULT_TRAINERS = [
  {
    id: 't1',
    name: 'Coach Alex Tan',
    specialties: ['Muay Thai', 'Kickboxing', 'Self-Defense'],
    bio: 'Former regional Muay Thai champion with over 10 years of coaching experience. Specializes in building core stamina, technique, and high-intensity fight training.',
    photo: '/muay_thai.png'
  },
  {
    id: 't2',
    name: 'Coach Marcus Lim',
    specialties: ['Strength Training', 'Bodybuilding', 'Powerlifting'],
    bio: 'Certified strength conditioning specialist. Passionate about posture correction, functional movements, and helping members hit their personal record lifts.',
    photo: '/personal_training.png'
  },
  {
    id: 't3',
    name: 'Coach Sarah Wong',
    specialties: ['Weight Loss & HIIT', 'Yoga & Flexibility', 'Nutrition Coaching'],
    bio: 'Dedicated fitness therapist. Focuses on holistic lifestyle transformations, flexible dieting strategies, and sustainable fat loss coaching.',
    photo: '/hero.png'
  }
];

const DEFAULT_PACKAGES = [
  {
    id: 'p1',
    name: 'Day Pass Access',
    price: 15,
    billingPeriod: 'per entry',
    features: ['Full gym access for 1 calendar day', 'Free locker and shower usage', 'Access to weights and cardio zones'],
    isPopular: false,
    badge: 'Single Entry'
  },
  {
    id: 'p2',
    name: 'All-Access Monthly Membership',
    price: 120,
    billingPeriod: 'per month',
    features: ['Unlimited entry to weights & cardio zones', 'Free locker, towel, and sauna access', '1 free personal trainer assessment session', '10% discount on in-gym supplements'],
    isPopular: true,
    badge: 'Most Popular'
  },
  {
    id: 'p3',
    name: 'Muay Thai & Functional Class Pack',
    price: 180,
    billingPeriod: 'per month',
    features: ['Unlimited general gym floor access', 'Unlimited Muay Thai group training classes', 'Access to bag training and pad drills', 'Priority booking for all group classes'],
    isPopular: false,
    badge: 'Fighter Pass'
  },
  {
    id: 'p4',
    name: 'VIP Personal Coaching Elite',
    price: 450,
    billingPeriod: 'per month',
    features: ['All-Access gym membership included', '8 sessions (1-on-1) with an assigned Personal Trainer', 'Customized weekly workout & nutrition tracking plans', 'Exclusive WhatsApp support with your coach'],
    isPopular: false,
    badge: 'Premium Coaching'
  }
];

const DEFAULT_CLASSES = [
  // Monday
  { id: 'c1', name: 'Muay Thai Fundamentals', day: 'Monday', time: '08:00 AM - 09:30 AM', trainer: 'Coach Alex Tan', room: 'Arena A', capacity: 15, enrolled: ['member@gmail.com'] },
  { id: 'c2', name: 'HIIT Circuit', day: 'Monday', time: '06:30 PM - 07:30 PM', trainer: 'Coach Sarah Wong', room: 'Studio B', capacity: 20, enrolled: [] },
  { id: 'c3', name: 'Powerlifting Base', day: 'Monday', time: '08:00 PM - 09:30 PM', trainer: 'Coach Marcus Lim', room: 'Gym Floor', capacity: 8, enrolled: [] },
  
  // Tuesday
  { id: 'c4', name: 'Muay Thai Pad & Sparring', day: 'Tuesday', time: '06:00 PM - 07:30 PM', trainer: 'Coach Alex Tan', room: 'Arena A', capacity: 12, enrolled: [] },
  { id: 'c5', name: 'Vinyasa Flow Yoga', day: 'Tuesday', time: '08:00 PM - 09:00 PM', trainer: 'Coach Sarah Wong', room: 'Studio B', capacity: 15, enrolled: [] },

  // Wednesday
  { id: 'c6', name: 'Muay Thai Bag Drills', day: 'Wednesday', time: '08:00 AM - 09:00 AM', trainer: 'Coach Alex Tan', room: 'Arena A', capacity: 20, enrolled: [] },
  { id: 'c7', name: 'Upper Body Blast', day: 'Wednesday', time: '07:00 PM - 08:00 PM', trainer: 'Coach Marcus Lim', room: 'Gym Floor', capacity: 10, enrolled: [] },

  // Thursday
  { id: 'c8', name: 'Zumba & Aerobics', day: 'Thursday', time: '06:30 PM - 07:30 PM', trainer: 'Coach Sarah Wong', room: 'Studio B', capacity: 25, enrolled: [] },
  { id: 'c9', name: 'Muay Thai Advanced Sparring', day: 'Thursday', time: '08:00 PM - 09:30 PM', trainer: 'Coach Alex Tan', room: 'Arena A', capacity: 10, enrolled: [] },

  // Friday
  { id: 'c10', name: 'Functional Core Strength', day: 'Friday', time: '06:00 PM - 07:00 PM', trainer: 'Coach Marcus Lim', room: 'Gym Floor', capacity: 12, enrolled: [] },
  { id: 'c11', name: 'Muay Thai Cardio Burn', day: 'Friday', time: '07:30 PM - 09:00 PM', trainer: 'Coach Alex Tan', room: 'Arena A', capacity: 20, enrolled: [] },

  // Saturday
  { id: 'c12', name: 'Weekend Yoga Flow', day: 'Saturday', time: '09:00 AM - 10:00 AM', trainer: 'Coach Sarah Wong', room: 'Studio B', capacity: 15, enrolled: [] },
  { id: 'c13', name: 'Muay Thai All-Level Combat', day: 'Saturday', time: '10:30 AM - 12:00 PM', trainer: 'Coach Alex Tan', room: 'Arena A', capacity: 25, enrolled: [] },

  // Sunday
  { id: 'c14', name: 'Strength Conditioning', day: 'Sunday', time: '10:00 AM - 11:30 AM', trainer: 'Coach Marcus Lim', room: 'Gym Floor', capacity: 15, enrolled: [] }
];

export const GymProvider = ({ children }) => {
  // Load initial states from LocalStorage or Fallback to default seed data
  const [gymSettings, setGymSettings] = useState(() => {
    const saved = localStorage.getItem('mf_settings');
    return saved ? JSON.parse(saved) : DEFAULT_GYM_SETTINGS;
  });

  const [trainers, setTrainers] = useState(() => {
    const saved = localStorage.getItem('mf_trainers');
    return saved ? JSON.parse(saved) : DEFAULT_TRAINERS;
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('mf_packages');
    return saved ? JSON.parse(saved) : DEFAULT_PACKAGES;
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('mf_timetable');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  // User State: Default simulated user is "Guest"
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mf_current_user');
    return saved ? JSON.parse(saved) : { email: null, role: 'guest', name: 'Guest' };
  });

  // Mock Members list (Database)
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('mf_members');
    if (saved) return JSON.parse(saved);
    
    // Seed with default profiles
    return [
      {
        email: 'member@gmail.com',
        name: 'Darren Teo',
        subscription: 'All-Access Monthly Membership',
        trainer: 'Coach Marcus Lim',
        ptSessionsLeft: 0,
      },
      {
        email: 'fighter@gmail.com',
        name: 'Muhammad Faiz',
        subscription: 'Muay Thai & Functional Class Pack',
        trainer: 'Coach Alex Tan',
        ptSessionsLeft: 0,
      },
      {
        email: 'vip@gmail.com',
        name: 'Rachel Chen',
        subscription: 'VIP Personal Coaching Elite',
        trainer: 'Coach Sarah Wong',
        ptSessionsLeft: 8,
      }
    ];
  });

  // PT bookings database
  const [ptBookings, setPtBookings] = useState(() => {
    const saved = localStorage.getItem('mf_pt_bookings');
    return saved ? JSON.parse(saved) : [
      { id: 'ptb1', memberEmail: 'vip@gmail.com', memberName: 'Rachel Chen', trainerId: 't3', trainerName: 'Coach Sarah Wong', day: 'Monday', time: '11:00 AM' },
      { id: 'ptb2', memberEmail: 'member@gmail.com', memberName: 'Darren Teo', trainerId: 't2', trainerName: 'Coach Marcus Lim', day: 'Wednesday', time: '05:00 PM' }
    ];
  });

  // Synchronize state with LocalStorage and update theme
  useEffect(() => {
    localStorage.setItem('mf_settings', JSON.stringify(gymSettings));
    
    // Dynamically update CSS custom properties for accent styling
    const activeTheme = THEMES[gymSettings.theme] || THEMES.lime;
    document.documentElement.style.setProperty('--primary-color', activeTheme.primary);
    document.documentElement.style.setProperty('--primary-glow', activeTheme.primaryGlow);
    document.documentElement.style.setProperty('--primary-dark', activeTheme.primaryDark);
  }, [gymSettings]);

  useEffect(() => {
    localStorage.setItem('mf_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('mf_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('mf_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('mf_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mf_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('mf_pt_bookings', JSON.stringify(ptBookings));
  }, [ptBookings]);

  // Auth Operations (Simulated)
  const login = (email, role) => {
    let name = role.charAt(0).toUpperCase() + role.slice(1);
    
    // Try to match registered members
    if (role === 'member') {
      const match = members.find(m => m.email.toLowerCase() === email.toLowerCase());
      if (match) {
        name = match.name;
      } else {
        // Create new member if not exists
        const newMember = {
          email: email.toLowerCase(),
          name: email.split('@')[0],
          subscription: null,
          trainer: null,
          ptSessionsLeft: 0
        };
        setMembers(prev => [...prev, newMember]);
        name = newMember.name;
      }
    } else if (role === 'trainer') {
      // Find trainer details
      let trainerId = email;
      if (email.includes('alex')) trainerId = 't1';
      else if (email.includes('marcus')) trainerId = 't2';
      else if (email.includes('sarah')) trainerId = 't3';
      
      const trainer = trainers.find(t => t.id === trainerId) || trainers[0];
      name = trainer.name;
      email = trainer.id; // Store trainer id as email identifier
    }

    setCurrentUser({ email: email.toLowerCase(), role, name });
  };

  const logout = () => {
    setCurrentUser({ email: null, role: 'guest', name: 'Guest' });
  };

  // Subscribe current user to a package
  const subscribeToPackage = (packageId) => {
    if (currentUser.role !== 'member') {
      alert('Please log in as a member to subscribe.');
      return false;
    }

    const targetPkg = packages.find(p => p.id === packageId);
    if (!targetPkg) return false;

    // Auto-assign trainer if VIP
    let assignedTrainer = null;
    let ptSessions = 0;
    if (targetPkg.id === 'p4') { // VIP package
      // Assign random trainer
      const randomIndex = Math.floor(Math.random() * trainers.length);
      assignedTrainer = trainers[randomIndex].name;
      ptSessions = 8;
    }

    setMembers(prev => prev.map(m => {
      if (m.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return {
          ...m,
          subscription: targetPkg.name,
          trainer: assignedTrainer || m.trainer,
          ptSessionsLeft: ptSessions
        };
      }
      return m;
    }));

    alert(`Successfully subscribed to ${targetPkg.name}!`);
    return true;
  };

  // Book a class
  const bookClass = (classId) => {
    if (currentUser.role !== 'member') {
      alert('Please sign in as a Member to book gym classes.');
      return false;
    }

    // Check if user has active subscription
    const memberProfile = members.find(m => m.email.toLowerCase() === currentUser.email.toLowerCase());
    if (!memberProfile || !memberProfile.subscription) {
      alert('Active subscription required to book classes. Please purchase a membership package first!');
      return false;
    }

    let success = false;
    let message = '';

    setTimetable(prev => prev.map(c => {
      if (c.id === classId) {
        if (c.enrolled.includes(currentUser.email)) {
          message = 'You have already booked this class!';
          return c;
        }
        if (c.enrolled.length >= c.capacity) {
          message = 'Sorry, this class is already full!';
          return c;
        }
        success = true;
        message = `Successfully booked class: ${c.name}!`;
        return { ...c, enrolled: [...c.enrolled, currentUser.email] };
      }
      return c;
    }));

    alert(message);
    return success;
  };

  // Cancel class booking
  const cancelClassBooking = (classId) => {
    if (currentUser.role !== 'member') return;

    setTimetable(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          enrolled: c.enrolled.filter(e => e.toLowerCase() !== currentUser.email.toLowerCase())
        };
      }
      return c;
    }));
    alert('Booking cancelled successfully.');
  };

  // Book personal trainer session
  const bookPtSession = (trainerId, day, time) => {
    if (currentUser.role !== 'member') {
      alert('Please sign in as a Member to book PT sessions.');
      return false;
    }

    const memberProfile = members.find(m => m.email.toLowerCase() === currentUser.email.toLowerCase());
    if (!memberProfile || !memberProfile.subscription) {
      alert('Please subscribe to a membership package first.');
      return false;
    }

    const coach = trainers.find(t => t.id === trainerId);
    if (!coach) return false;

    // Check if they have PT sessions left on VIP plan
    if (memberProfile.subscription.includes('VIP') && memberProfile.ptSessionsLeft <= 0) {
      alert('No Personal Training sessions left. Please renew or purchase a new package.');
      return false;
    }

    const newBooking = {
      id: 'ptb_' + Date.now(),
      memberEmail: currentUser.email,
      memberName: memberProfile.name,
      trainerId: coach.id,
      trainerName: coach.name,
      day,
      time
    };

    setPtBookings(prev => [...prev, newBooking]);

    // Update member's session count if VIP
    if (memberProfile.ptSessionsLeft > 0) {
      setMembers(prev => prev.map(m => {
        if (m.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return { ...m, ptSessionsLeft: m.ptSessionsLeft - 1 };
        }
        return m;
      }));
    }

    alert(`Successfully scheduled 1-on-1 session with ${coach.name} for ${day} at ${time}!`);
    return true;
  };

  // Cancel PT booking
  const cancelPtBooking = (bookingId) => {
    const booking = ptBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setPtBookings(prev => prev.filter(b => b.id !== bookingId));

    // Refund session count if VIP
    if (currentUser.role === 'member') {
      const memberProfile = members.find(m => m.email.toLowerCase() === currentUser.email.toLowerCase());
      if (memberProfile && memberProfile.subscription && memberProfile.subscription.includes('VIP')) {
        setMembers(prev => prev.map(m => {
          if (m.email.toLowerCase() === currentUser.email.toLowerCase()) {
            return { ...m, ptSessionsLeft: m.ptSessionsLeft + 1 };
          }
          return m;
        }));
      }
    }
    alert('Personal Training session cancelled.');
  };

  // Reset to default settings
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all configurations to default? This will clear bookings, subscriptions, and customized packages.')) {
      localStorage.removeItem('mf_settings');
      localStorage.removeItem('mf_trainers');
      localStorage.removeItem('mf_packages');
      localStorage.removeItem('mf_timetable');
      localStorage.removeItem('mf_members');
      localStorage.removeItem('mf_pt_bookings');
      
      setGymSettings(DEFAULT_GYM_SETTINGS);
      setTrainers(DEFAULT_TRAINERS);
      setPackages(DEFAULT_PACKAGES);
      setTimetable(DEFAULT_CLASSES);
      setPtBookings([
        { id: 'ptb1', memberEmail: 'vip@gmail.com', memberName: 'Rachel Chen', trainerId: 't3', trainerName: 'Coach Sarah Wong', day: 'Monday', time: '11:00 AM' },
        { id: 'ptb2', memberEmail: 'member@gmail.com', memberName: 'Darren Teo', trainerId: 't2', trainerName: 'Coach Marcus Lim', day: 'Wednesday', time: '05:00 PM' }
      ]);
      setMembers([
        { email: 'member@gmail.com', name: 'Darren Teo', subscription: 'All-Access Monthly Membership', trainer: 'Coach Marcus Lim', ptSessionsLeft: 0 },
        { email: 'fighter@gmail.com', name: 'Muhammad Faiz', subscription: 'Muay Thai & Functional Class Pack', trainer: 'Coach Alex Tan', ptSessionsLeft: 0 },
        { email: 'vip@gmail.com', name: 'Rachel Chen', subscription: 'VIP Personal Coaching Elite', trainer: 'Coach Sarah Wong', ptSessionsLeft: 8 }
      ]);
      setCurrentUser({ email: null, role: 'guest', name: 'Guest' });
      
      window.location.reload();
    }
  };

  return (
    <GymContext.Provider value={{
      gymSettings,
      setGymSettings,
      trainers,
      setTrainers,
      packages,
      setPackages,
      timetable,
      setTimetable,
      currentUser,
      members,
      setMembers,
      ptBookings,
      setPtBookings,
      login,
      logout,
      subscribeToPackage,
      bookClass,
      cancelClassBooking,
      bookPtSession,
      cancelPtBooking,
      resetToDefault
    }}>
      {children}
    </GymContext.Provider>
  );
};
