import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiClock, FiCheck, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Booking.css';

const Booking = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Load services and availability from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('booking_services');
    const savedAvailability = localStorage.getItem('booking_availability');
    const savedTimeSlots = localStorage.getItem('booking_timeslots');

    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      // Default services
      const defaultServices = [
        { id: 1, name: 'Personal Photoshoot', duration: '2 hours', price: 250, description: 'Intimate portrait session' },
        { id: 2, name: 'Wedding Photography', duration: 'Full day', price: 2500, description: 'Complete wedding coverage' },
        { id: 3, name: 'Fashion/Beauty Campaign', duration: '4 hours', price: 800, description: 'Professional campaign shoot' },
        { id: 4, name: 'Event Coverage', duration: '3 hours', price: 500, description: 'Corporate or private events' },
      ];
      setServices(defaultServices);
      localStorage.setItem('booking_services', JSON.stringify(defaultServices));
    }

    if (savedAvailability) {
      setAvailableDates(JSON.parse(savedAvailability));
    }

    if (savedTimeSlots) {
      setTimeSlots(JSON.parse(savedTimeSlots));
    } else {
      // Default time slots
      const defaultSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
      setTimeSlots(defaultSlots);
      localStorage.setItem('booking_timeslots', JSON.stringify(defaultSlots));
    }
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Past dates are not available
    if (date < today) return false;
    
    // If no availability set, all future dates are available
    if (availableDates.length === 0) return true;
    
    // Check if date is in available dates
    return availableDates.some(d => d.date === dateStr && d.available);
  };

  const isDateBlocked = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatDate(date);
    return availableDates.some(d => d.date === dateStr && !d.available);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const selectDate = (day) => {
    if (!isDateAvailable(day) || isDateBlocked(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save booking request
    const booking = {
      id: Date.now(),
      service: selectedService,
      date: formatDate(selectedDate),
      time: selectedTime,
      customer: formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem('booking_requests') || '[]');
    localStorage.setItem('booking_requests', JSON.stringify([...existingBookings, booking]));

    toast.success('Booking request submitted! Marta will contact you soon.');
    
    // Reset form
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const available = isDateAvailable(day);
      const blocked = isDateBlocked(day);
      const selected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      days.push(
        <div
          key={day}
          className={`calendar-day ${available && !blocked ? 'available' : 'unavailable'} ${selected ? 'selected' : ''}`}
          onClick={() => selectDate(day)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth} className="calendar-nav"><FiChevronLeft /></button>
          <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
          <button onClick={nextMonth} className="calendar-nav"><FiChevronRight /></button>
        </div>
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Book a Session</h1>
        <p>Select your preferred date, time, and service</p>
      </div>

      <div className="booking-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span className="step-number">{step > 1 ? <FiCheck /> : '1'}</span>
          <span className="step-label">Service</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span className="step-number">{step > 2 ? <FiCheck /> : '2'}</span>
          <span className="step-label">Date & Time</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Details</span>
        </div>
      </div>

      <div className="booking-content">
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="step-content">
            <h2>Select a Service</h2>
            <div className="services-grid">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-details">
                    <span className="service-duration"><FiClock /> {service.duration}</span>
                    <span className="service-price">€{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="step-actions">
              <button 
                className="next-btn" 
                disabled={!selectedService}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="step-content">
            <h2>Select Date & Time</h2>
            <div className="datetime-grid">
              <div className="calendar-section">
                {renderCalendar()}
              </div>
              <div className="time-section">
                <h3>Available Times</h3>
                {selectedDate ? (
                  <div className="time-slots">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="select-date-msg">Please select a date first</p>
                )}
              </div>
            </div>
            <div className="step-actions">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
              <button 
                className="next-btn" 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="step-content">
            <h2>Your Details</h2>
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Service:</span>
                <strong>{selectedService?.name}</strong>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <strong>{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </div>
              <div className="summary-item">
                <span>Time:</span>
                <strong>{selectedTime}</strong>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <strong>€{selectedService?.price}</strong>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label><FiUser /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label><FiMail /> Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label><FiPhone /> Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="+420 123 456 789"
                />
              </div>
              <div className="form-group">
                <label>Message (optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="Tell me about your vision..."
                ></textarea>
              </div>
              <div className="step-actions">
                <button type="button" className="back-btn" onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="submit-btn">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
