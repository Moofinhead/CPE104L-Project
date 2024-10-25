"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from 'next/link';

const UserPage = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

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
                    <div className="row">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="col-md-6 mb-4">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{booking.roomName}</h5>
                              <p className="card-text">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                              <p className="card-text">Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                              <p className="card-text">Guests: {booking.guestCount}</p>
                              <p className="card-text">Total: ${booking.total}</p>
                              <button className="btn btn-danger" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
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
    </RoveroLayout>
  );
};

export default UserPage;