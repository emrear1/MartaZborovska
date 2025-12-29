import React, { useState, useEffect } from 'react';
import { FiUpload, FiImage, FiVideo, FiTrash2, FiEdit2, FiX, FiCalendar, FiDollarSign, FiUsers, FiPlus, FiCheck, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Booking related state
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Load all data from localStorage
  useEffect(() => {
    // Photos & Videos
    const savedPhotos = localStorage.getItem('portfolio_photos');
    const savedVideos = localStorage.getItem('portfolio_videos');
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedVideos) setVideos(JSON.parse(savedVideos));

    // Services
    const savedServices = localStorage.getItem('booking_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      const defaultServices = [
        { id: 1, name: 'Personal Photoshoot', duration: '2 hours', price: 250, description: 'Intimate portrait session' },
        { id: 2, name: 'Wedding Photography', duration: 'Full day', price: 2500, description: 'Complete wedding coverage' },
        { id: 3, name: 'Fashion/Beauty Campaign', duration: '4 hours', price: 800, description: 'Professional campaign shoot' },
        { id: 4, name: 'Event Coverage', duration: '3 hours', price: 500, description: 'Corporate or private events' },
      ];
      setServices(defaultServices);
      localStorage.setItem('booking_services', JSON.stringify(defaultServices));
    }

    // Availability
    const savedAvailability = localStorage.getItem('booking_availability');
    if (savedAvailability) setAvailability(JSON.parse(savedAvailability));

    // Bookings
    const savedBookings = localStorage.getItem('booking_requests');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  // Compress and convert image to base64
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);

    try {
      const newItems = [];
      for (const file of files) {
        if (type === 'photos' && !file.type.startsWith('image/')) continue;
        if (type === 'videos' && !file.type.startsWith('video/')) continue;

        const base64Url = await compressImage(file);
        newItems.push({
          id: Date.now() + Math.random(),
          name: file.name,
          url: base64Url,
          category: 'portrait',
          title: file.name.replace(/\.[^/.]+$/, ''),
          uploadedAt: new Date().toISOString(),
          position: 'center center',
        });
      }

      if (newItems.length > 0) {
        if (type === 'photos') {
          const updated = [...photos, ...newItems];
          setPhotos(updated);
          localStorage.setItem('portfolio_photos', JSON.stringify(updated));
        } else {
          const updated = [...videos, ...newItems];
          setVideos(updated);
          localStorage.setItem('portfolio_videos', JSON.stringify(updated));
        }
        toast.success(`${newItems.length} file(s) uploaded`);
      }
    } catch (error) {
      toast.error('Error uploading files');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Delete this item?')) {
      if (type === 'photos') {
        const updated = photos.filter(p => p.id !== id);
        setPhotos(updated);
        localStorage.setItem('portfolio_photos', JSON.stringify(updated));
      } else {
        const updated = videos.filter(v => v.id !== id);
        setVideos(updated);
        localStorage.setItem('portfolio_videos', JSON.stringify(updated));
      }
      toast.success('Deleted');
    }
  };

  const handleEdit = (item, type) => setEditingItem({ ...item, type });

  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (editingItem.type === 'photos') {
      const updated = photos.map(p => p.id === editingItem.id ? { ...p, ...editingItem } : p);
      setPhotos(updated);
      localStorage.setItem('portfolio_photos', JSON.stringify(updated));
    } else {
      const updated = videos.map(v => v.id === editingItem.id ? { ...v, ...editingItem } : v);
      setVideos(updated);
      localStorage.setItem('portfolio_videos', JSON.stringify(updated));
    }
    setEditingItem(null);
    toast.success('Saved');
  };

  // Service Management
  const addService = () => {
    setEditingService({
      id: Date.now(),
      name: '',
      duration: '',
      price: 0,
      description: '',
      isNew: true
    });
  };

  const saveService = () => {
    if (!editingService.name || !editingService.price) {
      toast.error('Name and price are required');
      return;
    }
    let updated;
    if (editingService.isNew) {
      updated = [...services, { ...editingService, isNew: undefined }];
    } else {
      updated = services.map(s => s.id === editingService.id ? editingService : s);
    }
    setServices(updated);
    localStorage.setItem('booking_services', JSON.stringify(updated));
    setEditingService(null);
    toast.success('Service saved');
  };

  const deleteService = (id) => {
    if (window.confirm('Delete this service?')) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem('booking_services', JSON.stringify(updated));
      toast.success('Service deleted');
    }
  };

  // Availability Management
  const toggleDateAvailability = (dateStr) => {
    const existing = availability.find(a => a.date === dateStr);
    let updated;
    if (existing) {
      updated = availability.map(a => 
        a.date === dateStr ? { ...a, available: !a.available } : a
      );
    } else {
      updated = [...availability, { date: dateStr, available: false }];
    }
    setAvailability(updated);
    localStorage.setItem('booking_availability', JSON.stringify(updated));
  };

  const isDateBlocked = (dateStr) => {
    const item = availability.find(a => a.date === dateStr);
    return item && !item.available;
  };

  // Booking Management
  const updateBookingStatus = (id, status) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem('booking_requests', JSON.stringify(updated));
    toast.success(`Booking ${status}`);
  };

  const deleteBooking = (id) => {
    if (window.confirm('Delete this booking?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('booking_requests', JSON.stringify(updated));
      toast.success('Booking deleted');
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const renderAvailabilityCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(selectedMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const blocked = isDateBlocked(dateStr);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <div
          key={day}
          className={`cal-day ${blocked ? 'blocked' : 'available'} ${isPast ? 'past' : ''}`}
          onClick={() => !isPast && toggleDateAvailability(dateStr)}
        >
          <span>{day}</span>
          {blocked && <FiX className="blocked-icon" />}
        </div>
      );
    }

    return (
      <div className="availability-calendar">
        <div className="cal-header">
          <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))}>←</button>
          <h3>{monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}</h3>
          <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))}>→</button>
        </div>
        <div className="cal-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="cal-days">{days}</div>
        <p className="cal-hint">Click a date to block/unblock. Red = blocked, Green = available</p>
      </div>
    );
  };

  const getPositionValues = (position) => {
    if (!position) return { left: '50%', top: '50%' };
    const parts = position.split(' ');
    let left = '50%', top = '50%';
    if (parts[0] === 'left') left = '0%';
    else if (parts[0] === 'right') left = '100%';
    else if (parts[0] !== 'center') left = parts[0];
    if (parts[1] === 'top') top = '0%';
    else if (parts[1] === 'bottom') top = '100%';
    else if (parts[1] !== 'center') top = parts[1];
    return { left, top };
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage portfolio, services, and bookings</p>
      </div>

      <div className="admin-tabs">
        <button className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
          <FiImage /> Photos
        </button>
        <button className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
          <FiVideo /> Videos
        </button>
        <button className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
          <FiDollarSign /> Services
        </button>
        <button className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`} onClick={() => setActiveTab('availability')}>
          <FiCalendar /> Availability
        </button>
        <button className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          <FiUsers /> Bookings {bookings.filter(b => b.status === 'pending').length > 0 && <span className="badge">{bookings.filter(b => b.status === 'pending').length}</span>}
        </button>
      </div>

      <div className="admin-content">
        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <>
            <div className="upload-section">
              <label className="upload-button">
                <FiUpload /> Upload Photos
                <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'photos')} disabled={uploading} style={{ display: 'none' }} />
              </label>
              {uploading && <p className="upload-status">Uploading...</p>}
            </div>
            <div className="media-grid">
              {photos.map((item) => (
                <div key={item.id} className="media-item">
                  <img src={item.url} alt={item.title} style={{ objectPosition: item.position || 'center center' }} />
                  <div className="media-overlay">
                    <div className="media-info"><h3>{item.title}</h3></div>
                    <div className="media-actions">
                      <button onClick={() => handleEdit(item, 'photos')} className="action-btn edit"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(item.id, 'photos')} className="action-btn delete"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {photos.length === 0 && <div className="empty-state"><p>No photos uploaded yet.</p></div>}
          </>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <>
            <div className="upload-section">
              <label className="upload-button">
                <FiUpload /> Upload Videos
                <input type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e, 'videos')} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>
            <div className="media-grid">
              {videos.map((item) => (
                <div key={item.id} className="media-item">
                  <video src={item.url} muted />
                  <div className="media-overlay">
                    <div className="media-info"><h3>{item.title}</h3></div>
                    <div className="media-actions">
                      <button onClick={() => handleEdit(item, 'videos')} className="action-btn edit"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(item.id, 'videos')} className="action-btn delete"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {videos.length === 0 && <div className="empty-state"><p>No videos uploaded yet.</p></div>}
          </>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="services-tab">
            <button className="add-service-btn" onClick={addService}><FiPlus /> Add Service</button>
            <div className="services-list">
              {services.map(service => (
                <div key={service.id} className="service-item">
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-meta">
                      <span><FiClock /> {service.duration}</span>
                      <span className="price">€{service.price}</span>
                    </div>
                  </div>
                  <div className="service-actions">
                    <button onClick={() => setEditingService(service)} className="action-btn edit"><FiEdit2 /></button>
                    <button onClick={() => deleteService(service.id)} className="action-btn delete"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="availability-tab">
            <h2>Manage Availability</h2>
            <p>Click on dates to block them. Blocked dates will not be available for booking.</p>
            {renderAvailabilityCalendar()}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-tab">
            <h2>Booking Requests</h2>
            {bookings.length === 0 ? (
              <div className="empty-state"><p>No booking requests yet.</p></div>
            ) : (
              <div className="bookings-list">
                {bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(booking => (
                  <div key={booking.id} className={`booking-item ${booking.status}`}>
                    <div className="booking-header">
                      <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      <span className="booking-date">{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="booking-details">
                      <div className="detail"><strong>Service:</strong> {booking.service?.name}</div>
                      <div className="detail"><strong>Date:</strong> {booking.date} at {booking.time}</div>
                      <div className="detail"><strong>Price:</strong> €{booking.service?.price}</div>
                      <div className="detail"><strong>Customer:</strong> {booking.customer?.name}</div>
                      <div className="detail"><strong>Email:</strong> {booking.customer?.email}</div>
                      <div className="detail"><strong>Phone:</strong> {booking.customer?.phone}</div>
                      {booking.customer?.message && <div className="detail"><strong>Message:</strong> {booking.customer.message}</div>}
                    </div>
                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="confirm-btn"><FiCheck /> Confirm</button>
                          <button onClick={() => updateBookingStatus(booking.id, 'rejected')} className="reject-btn"><FiX /> Reject</button>
                        </>
                      )}
                      <button onClick={() => deleteBooking(booking.id)} className="delete-btn"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Photo/Video Modal */}
      {editingItem && (
        <div className="edit-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setEditingItem(null)}><FiX /></button>
            <h2>Edit {editingItem.type === 'photos' ? 'Photo' : 'Video'}</h2>
            {editingItem.type === 'photos' && (
              <div className="form-group">
                <label>Focal Point</label>
                <div className="position-picker">
                  <div className="position-preview" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    setEditingItem({ ...editingItem, position: `${x}% ${y}%` });
                  }}>
                    <img src={editingItem.url} alt="Preview" style={{ objectPosition: editingItem.position || 'center center' }} />
                    <div className="position-marker" style={getPositionValues(editingItem.position)}></div>
                  </div>
                  <div className="position-presets">
                    {['left top', 'center top', 'right top', 'left center', 'center center', 'right center', 'left bottom', 'center bottom', 'right bottom'].map(pos => (
                      <button key={pos} type="button" className={editingItem.position === pos ? 'active' : ''} onClick={() => setEditingItem({ ...editingItem, position: pos })}>
                        {pos === 'center center' ? '●' : {'left top': '↖', 'center top': '↑', 'right top': '↗', 'left center': '←', 'right center': '→', 'left bottom': '↙', 'center bottom': '↓', 'right bottom': '↘'}[pos]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
            </div>
            <button className="save-button" onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="edit-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setEditingService(null)}><FiX /></button>
            <h2>{editingService.isNew ? 'Add Service' : 'Edit Service'}</h2>
            <div className="form-group">
              <label>Service Name</label>
              <input type="text" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} placeholder="e.g. Wedding Photography" />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input type="text" value={editingService.duration} onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })} placeholder="e.g. 4 hours" />
            </div>
            <div className="form-group">
              <label>Price (€)</label>
              <input type="number" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })} placeholder="e.g. 500" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} rows="3" placeholder="Brief description..." />
            </div>
            <button className="save-button" onClick={saveService}>Save Service</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
