"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from 'next/link';
import { format } from 'date-fns';

const UserPage = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editedBooking, setEditedBooking] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [maxGuests, setMaxGuests] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user) {
      fetchUserInfo();
      fetchUserBookings();
    }
  }, [user, isLoading, router]);

  const fetchUserInfo = async () => {
    if (!user || !user.email) return;
    try {
      const response = await fetch(`http://localhost:8080/user/info?email=${user.email}`);
      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      setUserInfo(data);
      setEditedInfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchUserBookings = async () => {
    if (!user || !user.email) return;
    try {
      const response = await fetch(`http://localhost:8080/user/bookings?email=${user.email}`);
      if (!response.ok) throw new Error('Failed to fetch user bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const fetchAvailableRooms = async (checkInDate, checkOutDate) => {
    try {
      const response = await fetch(
        `http://localhost:8080/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      );
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      const availableRooms = data.filter(room => room.isAvailable);
      setAvailableRooms(availableRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/update?email=${user.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedInfo),
      });
      if (!response.ok) throw new Error('Failed to update user info');
      setUserInfo(editedInfo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const handleEditBooking = async (booking) => {
    setSelectedBooking(booking);
    setEditedBooking({
      ...booking,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      guestCount: booking.guestCount,
      roomId: booking.roomId
    });
    await fetchAvailableRooms(booking.checkInDate, booking.checkOutDate);
    setShowConfirmDialog(true);
  };

  const handleUpdateBooking = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/bookings/${selectedBooking.bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedBooking),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'ROOM_NOT_AVAILABLE') {
          alert('Selected dates are not available for this room. Please choose different dates.');
          return;
        }
        throw new Error(data.error || 'Failed to update booking');
      }

      setShowSuccessDialog(true);
      fetchUserBookings();
      setIsEditingBooking(false);
      setSelectedBooking(null);
      setEditedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/user/delete?email=${user.email}`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to delete account');
        logout();
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:8080/user/cancel-booking?email=${user.email}&bookingId=${bookingId}`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to cancel booking');
        fetchUserBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const ConfirmDialog = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Booking</h3>
        <p>Are you sure you want to edit this booking?</p>
        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setShowConfirmDialog(false);
              setIsEditingBooking(true);
            }}
          >
            Yes, Edit Booking
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setShowConfirmDialog(false);
              setSelectedBooking(null);
              setEditedBooking(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const EditBookingForm = () => {
    const [dateError, setDateError] = useState('');
    const today = format(new Date(), 'yyyy-MM-dd');

    const handleDateChange = async (type, value) => {
      let newDates = {
        checkInDate: editedBooking.checkInDate,
        checkOutDate: editedBooking.checkOutDate
      };

      if (type === 'checkIn') {
        newDates.checkInDate = value;
        if (value > editedBooking.checkOutDate) {
          newDates.checkOutDate = value;
        }
      } else {
        newDates.checkOutDate = value;
      }

      if (newDates.checkInDate < today) {
        setDateError('Check-in date cannot be in the past');
        return;
      }
      if (newDates.checkOutDate < newDates.checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }

      setDateError('');
      setEditedBooking({
        ...editedBooking,
        ...newDates
      });

      await fetchAvailableRooms(newDates.checkInDate, newDates.checkOutDate);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Edit Booking Details</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateBooking();
          }}>
            <div className="mb-3">
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                className="form-control"
                value={editedBooking.checkInDate}
                min={today}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Check-out Date</label>
              <input
                type="date"
                className="form-control"
                value={editedBooking.checkOutDate}
                min={editedBooking.checkInDate}
                onChange={(e) => handleDateChange('checkOut', e.target.value)}
              />
            </div>
            {dateError && (
              <div className="alert alert-danger mb-3">
                {dateError}
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Room</label>
              <select 
                className="form-control"
                value={editedBooking.roomId}
                onChange={(e) => {
                  const selectedRoom = availableRooms.find(room => room.id === e.target.value);
                  setEditedBooking({
                    ...editedBooking,
                    roomId: e.target.value,
                    guestCount: Math.min(editedBooking.guestCount, selectedRoom.maxGuests)
                  });
                  setMaxGuests(selectedRoom.maxGuests);
                }}
              >
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} {room.id === editedBooking.roomId ? '(Current)' : ''}
                  </option>
                ))}
              </select>
              {availableRooms.length === 0 && (
                <small className="text-danger">
                  No rooms available for selected dates
                </small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Number of Guests</label>
              <input
                type="number"
                className="form-control"
                value={editedBooking.guestCount}
                min={1}
                max={maxGuests}
                onChange={(e) => setEditedBooking({
                  ...editedBooking,
                  guestCount: Math.min(parseInt(e.target.value), maxGuests)
                })}
              />
              <small className="text-muted">Maximum guests allowed: {maxGuests}</small>
            </div>
            <div className="button-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={dateError !== '' || availableRooms.length === 0}
              >
                Update Booking
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsEditingBooking(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SuccessDialog = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Success!</h3>
        <p>Your booking has been updated successfully.</p>
        <button className="btn btn-primary" onClick={() => setShowSuccessDialog(false)}>
          Close
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <RoveroLayout>
        <div className="user-page-area mt-120 mb-120">
          <div className="container">
            <div className="text-center">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </RoveroLayout>
    );
  }

  if (!user) {
    return (
      <RoveroLayout>
        <div className="user-page-area mt-120 mb-120">
          <div className="container">
            <div className="text-center">
              <h2>Please log in to view your dashboard</h2>
              <Link href="/login" className="btn btn-primary mt-3">Go to Login</Link>
            </div>
          </div>
        </div>
      </RoveroLayout>
    );
  }

  if (!user || !userInfo) return null;

  return (
    <RoveroLayout>
      <div className="user-page-area mt-120 mb-120">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="user-sidebar">
                <div className="user-avatar mb-4 text-center">
                  <img src={user.avatar || '/images/default-avatar.png'} alt="User Avatar" className="rounded-circle" style={{width: '150px', height: '150px'}} />
                </div>
                <h3 className="text-center mb-4">{user.nickname}</h3>
                <ul className="list-unstyled">
                  <li className={`mb-2 ${activeTab === 'profile' ? 'active' : ''}`}>
                    <button className="btn btn-link" onClick={() => setActiveTab('profile')}>Profile</button>
                  </li>
                  <li className={`mb-2 ${activeTab === 'bookings' ? 'active' : ''}`}>
                    <button className="btn btn-link" onClick={() => setActiveTab('bookings')}>My Bookings</button>
                  </li>
                  <li className="mb-2">
                    <button className="btn btn-link text-danger" onClick={handleDeleteAccount}>Delete Account</button>
                  </li>
                  <li className="mb-2">
                    <button className="btn btn-link" onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-9">
              {activeTab === 'profile' && (
                <div className="user-profile">
                  <h2 className="mb-4">My Profile</h2>
                  {isEditing ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateInfo(); }}>
                      <div className="mb-3">
                        <label htmlFor="nickname" className="form-label">Nickname</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nickname"
                          value={editedInfo.nickname}
                          onChange={(e) => setEditedInfo({...editedInfo, nickname: e.target.value})}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={editedInfo.email}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          value={editedInfo.phone}
                          onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                  ) : (
                    <div>
                      <p><strong>Nickname:</strong> {userInfo.nickname}</p>
                      <p><strong>Email:</strong> {userInfo.email}</p>
                      <p><strong>Phone:</strong> {userInfo.phone}</p>
                      <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'bookings' && (
                <div className="user-bookings">
                  <h2 className="mb-4">My Bookings</h2>
                  {bookings.length > 0 ? (
                    <div className="booking-list">
                      {bookings.map((booking) => (
                        <div key={booking.bookingId} className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="card-title">Booking ID: {booking.bookingId}</h5>
                                <p className="card-text">
                                  Room: {booking.roomId} | 
                                  Check-in: {new Date(booking.checkInDate).toLocaleDateString()} | 
                                  Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} | 
                                  Guests: {booking.guestCount}
                                </p>
                              </div>
                              <div>
                                <span className="badge bg-primary me-2">
                                  ${booking.total || booking.priceDetails?.total || 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <button 
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEditBooking(booking)}
                              >
                                Edit Booking
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleCancelBooking(booking.bookingId)}
                              >
                                Cancel Booking
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>You have no bookings yet. <Link href="/booking">Book a room now!</Link></p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showConfirmDialog && <ConfirmDialog />}
      {isEditingBooking && <EditBookingForm />}
      {showSuccessDialog && <SuccessDialog />}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .badge {
          font-size: 1rem;
          padding: 0.5rem 1rem;
        }
      `}</style>
    </RoveroLayout>
  );
};

export default UserPage;