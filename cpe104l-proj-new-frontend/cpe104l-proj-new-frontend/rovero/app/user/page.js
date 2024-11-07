"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import RoveroLayout from "@/layouts/RoveroLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { UserSidebar } from '@/components/user/userSidebar';
import { fetchUserInfo } from '@/components/user/fetchData';
import { renderLoadingState } from '@/components/user/renderUtils';
import { updateUserInfo } from '@/components/user/updateUserInfo';
import ConfirmDialog from "@/components/ConfirmDialog";
import EditBookingForm from "@/components/EditBookingForm";

const getFormattedDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getFormattedDate(tomorrow);
};

// Move EditForm to be a separate component outside of UserPage
const EditForm = ({ editedInfo, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState(editedInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const handleChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={formValues.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="phoneNo" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phoneNo"
            value={formValues.phoneNo || ''}
            onChange={(e) => handleChange('phoneNo', e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            value={formValues.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            value={formValues.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={formValues.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={formValues.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="country" className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            id="country"
            value={formValues.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="zipCode" className="form-label">Zip Code</label>
          <input
            type="text"
            className="form-control"
            id="zipCode"
            value={formValues.zipCode || ''}
            onChange={(e) => handleChange('zipCode', e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary me-2">Save Changes</button>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

const UserPage = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const [bookings, setBookings] = useState([]);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editedBooking, setEditedBooking] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [maxGuests, setMaxGuests] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);
  const [newPriceDetails, setNewPriceDetails] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [pendingBookingUpdate, setPendingBookingUpdate] = useState(null);

  // Add debounced state update
  const debounceTimeout = useRef(null);
  
  const handleInputChange = useCallback((field, value) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setEditedInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }, 300); // 300ms delay
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user && !userInfo) {
      fetchUserInfo(user.email, setUserInfo, setEditedInfo);
    } else if (user && activeTab === 'bookings') {
      fetchUserBookings(user.email); // Pass the user's email
    }
  }, [user, isLoading, router, userInfo, activeTab]);

  const fetchUserBookings = async (email) => {
    if (email) {
      try {
        const response = await fetch(`http://localhost:8080/user/bookings?email=${email}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data || []); // Ensure it defaults to an empty array if null
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        setBookings([]); // Ensure it defaults to an empty array on error
      }
    } else {
      console.error('User email is undefined');
    }
  };

  const cancelBooking = async (bookingId) => {
    const email = user.email; // Assuming user.email contains the logged-in user's email
    try {
      const response = await fetch(`http://localhost:8080/user/cancel-booking?email=${email}&bookingId=${bookingId}`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return true;
    } catch (error) {
      console.error('Error canceling booking:', error);
      return false;
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const updateData = {
        address: editedInfo.address || '',
        city: editedInfo.city || '',
        country: editedInfo.country || '',
        firstName: editedInfo.firstName || '',
        lastName: editedInfo.lastName || '',
        phoneNo: editedInfo.phoneNo || '',
        username: editedInfo.username || '',
        zipCode: editedInfo.zipCode || ''
      };

      console.log('Sending update request with data:', updateData);

      const response = await fetch(`http://localhost:8080/user/update?email=${user.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        // Update the local userInfo state with the edited values
        setUserInfo(prev => ({
          ...prev,
          ...updateData
        }));
        setIsEditing(false);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };


  // ! TO FIX (DELETES ACCOUNT BUT ISSUE WITH CORS PERSISTS HERE)
  const deleteUserAccount = async (email) => {
    const response = await fetch(`http://localhost:8080/user/delete?email=${email}`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to delete account');
  };

  // ! TO FIX (DELETES BOOKING BUT ROOM REMAINS BOOKED AND ISSUE WITH CORS PERSISTS HERE)
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserAccount(user.email);
        logout();
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderEditForm = () => (
    <EditForm 
      editedInfo={editedInfo}
      onSubmit={handleUpdateInfo}
      onCancel={() => setIsEditing(false)}
    />
  );

  const renderProfileInfo = () => (
    <div>
      <p><strong>Username:</strong> {userInfo.username || 'Anonymous'}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Phone:</strong> {userInfo.phone}</p>
      <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
    </div>
  );

  const renderBookings = () => (
    <div className="user-bookings">
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <h3>Booking ID: {booking.bookingId}</h3>
              <p>
                Room: {booking.roomId} | Check-in: {new Date(booking.checkInDate).toLocaleDateString()} | 
                Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} | 
                Guests: {booking.guestCount}
              </p>
              <div className="booking-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleEditBooking(booking)}
                >
                  Edit Booking
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => cancelBooking(booking.bookingId)}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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

  const handleEditBooking = async (booking) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    // Make sure we have the roomId
    if (!booking.roomId) {
      console.error('No roomId in booking:', booking);
      return;
    }

    const editedBookingData = {
      roomId: booking.roomId,  // Ensure this is set
      checkInDate: formatDate(booking.checkInDate),
      checkOutDate: formatDate(booking.checkOutDate),
      guestCount: booking.guestCount,
      addons: {
        enableWifi: false,
        smokingZone: false,
        view: "None",
        serviceGuide: false,
        dinner: false,
        petAllowed: false,
        swimmingPool: false,
        breakfastBuffet: false,
        childCorner: false
      },
      couponCode: booking.couponCode || ''
    };

    setEditedBooking(editedBookingData);
    setSelectedBooking({
      ...booking,
      addons: editedBookingData.addons
    });

    // Fetch maxGuests
    try {
      const response = await fetch(`http://localhost:8080/get-max-guests?roomId=${booking.roomId}`);
      if (!response.ok) throw new Error('Failed to fetch room details');
      const data = await response.json();
      setMaxGuests(data.maxGuests);
    } catch (error) {
      console.error('Error fetching room details:', error);
      setMaxGuests(5);
    }

    setShowConfirmDialog(true);
  };

  const submitBookingUpdate = async () => {
    try {
      if (!pendingBookingUpdate || !selectedBooking) {
        console.error('Missing required data for update');
        return;
      }

      const updateResponse = await fetch(`http://localhost:8080/user/update-booking/${selectedBooking.bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingBookingUpdate,
          email: user.email
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update booking');
      }

      // Success handling
      setShowSuccessDialog(true);
      await fetchUserBookings(user.email);
      setIsEditingBooking(false);
      setSelectedBooking(null);
      setEditedBooking(null);
      setPriceWarning(false);
      setPendingBookingUpdate(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      setBookingError(error.message);
    }
  };

  const handleUpdateBooking = async (formData) => {
    try {
      // Store the original booking details before update
      const originalBooking = { ...selectedBooking };
      
      const roomResponse = await fetch(`http://localhost:8080/admin/rooms/${formData.roomId}`);
      if (!roomResponse.ok) {
        throw new Error('Failed to fetch room details');
      }
      const roomData = await roomResponse.json();

      const requestPayload = {
        roomId: formData.roomId,
        room: roomData,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guestCount: parseInt(formData.guestCount),
        addons: {
          enableWifi: false,
          smokingZone: false,
          view: "None",
          serviceGuide: false,
          dinner: false,
          petAllowed: false,
          swimmingPool: false,
          breakfastBuffet: false,
          childCorner: false
        }
      };

      const updateResponse = await fetch(`http://localhost:8080/admin/bookings/${selectedBooking.bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update booking');
      }

      // Store both the original and updated booking details
      setSelectedBooking(originalBooking);
      setEditedBooking({
        ...requestPayload,
        room: roomData // Include room details for comparison
      });
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Update bookings list after a delay
      setTimeout(async () => {
        await fetchUserBookings(user.email);
      }, 2000);

    } catch (error) {
      console.error('Error updating booking:', error);
      setBookingError(error.message);
    }
  };

  const PriceWarningModal = () => (
    <div className="modal-wrapper">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Price Change Warning</h3>
            <button className="close-btn" onClick={() => setPriceWarning(false)}>×</button>
          </div>
          <div className="modal-body">
            <p>Your booking changes will result in a price change:</p>
            <div className="price-details">
              <p>Original Price: ${selectedBooking.price}</p>
              <p>New Price: ${newPriceDetails.total}</p>
              <p>Difference: ${newPriceDetails.total - selectedBooking.price}</p>
            </div>
            <p>Do you want to proceed with these changes?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={submitBookingUpdate}>
              Yes, Proceed
            </button>
            <button className="btn btn-secondary" onClick={() => setPriceWarning(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessDialog = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Success</h3>
          <button 
            className="close-btn" 
            onClick={() => setShowSuccessDialog(false)}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>Your booking has been updated successfully.</p>
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowSuccessDialog(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const calculateNewPrice = () => {
    const selectedRoom = availableRooms.find(room => room.id === editedBooking.roomId);
    const nights = Math.ceil(
      (new Date(editedBooking.checkOutDate) - new Date(editedBooking.checkInDate)) / 
      (1000 * 60 * 60 * 24)
    );
    return selectedRoom.price * nights;
  };

  const isFieldChanged = (oldValue, newValue) => oldValue !== newValue;

  if (isLoading) return renderLoadingState();
  if (!user) return null;
  if (!userInfo) return null;

  return (
    <RoveroLayout>
      <Breadcrumb pageName="User" pageTitle={`Welcome, ${userInfo.username || ''}`} pageSubTitle="This is your Profile Page." />
      <div className="user-page-area mt-120 mb-120">
        <div className="container">
          <div className="row">
            <UserSidebar 
              onLogout={handleLogout} 
              onDeleteAccount={handleDeleteAccount} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <div className="col-md-9">
              {activeTab === 'profile' && (
                <div className="user-profile">
                  <h2 className="mb-4">My Profile</h2>
                  {isEditing ? renderEditForm() : renderProfileInfo()}
                </div>
              )}
              {activeTab === 'bookings' && renderBookings()}
            </div>
          </div>
        </div>
      </div>
      {showConfirmDialog && (
        <ConfirmDialog 
          onConfirm={() => {
            setShowConfirmDialog(false);
            setTimeout(() => {
              setIsEditingBooking(true);
            }, 100);
          }}
          onClose={() => setShowConfirmDialog(false)}
        />
      )}
      
      {isEditingBooking && (
        <EditBookingForm 
          editedBooking={editedBooking}
          onSubmit={handleUpdateBooking}
          onClose={() => setIsEditingBooking(false)}
          availableRooms={availableRooms}
          setAvailableRooms={setAvailableRooms}
          maxGuests={maxGuests}
        />
      )}
      
      {priceWarning && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Price Change Warning</h5>
            </div>
            <div className="modal-body">
              <p>The price has changed. Do you want to proceed with the update?</p>
              <p>New Price: ${newPriceDetails?.total}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={submitBookingUpdate}>
                Yes, Proceed
              </button>
              <button className="btn btn-secondary" onClick={() => {
                setPriceWarning(false);
                setPendingBookingUpdate(null);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessDialog && selectedBooking && editedBooking && (
        <>
          <style>
            {`
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
                z-index: 1050;
              }

              .modal-dialog {
                background: white;
                border-radius: 12px;
                width: 95%;
                max-width: 800px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }

              .booking-comparison {
                display: flex;
                justify-content: space-between;
                align-items: stretch;
                padding: 20px 0;
              }

              .comparison-column {
                flex: 1;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
              }

              .comparison-divider {
                display: flex;
                align-items: center;
                padding: 0 20px;
                color: #666;
                font-size: 24px;
              }

              .booking-details {
                margin-top: 15px;
              }

              .booking-details p {
                margin-bottom: 10px;
                line-height: 1.5;
              }

              .booking-details strong {
                color: #333;
                margin-right: 8px;
              }

              .comparison-column:first-child {
                background: #fff5f5;
              }

              .comparison-column:last-child {
                background: #f0fff4;
              }

              .changed {
                background-color: #fdf6b2;
                padding: 2px 6px;
                border-radius: 4px;
                position: relative;
              }

              .changed::after {
                content: '(Changed)';
                font-size: 0.8em;
                color: #92400e;
                margin-left: 8px;
              }
            `}
          </style>
          <div className="modal-overlay">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Booking Updated Successfully</h3>
                  <button 
                    className="close-btn" 
                    onClick={() => setShowSuccessDialog(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="booking-comparison">
                    <div className="comparison-column">
                      <h4>Previous Booking</h4>
                      <div className="booking-details">
                        <p><strong>Room:</strong> {selectedBooking.room?.name || selectedBooking.roomId}</p>
                        <p><strong>Check-in:</strong> {new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                        <p><strong>Guests:</strong> {selectedBooking.guestCount}</p>
                      </div>
                    </div>
                    <div className="comparison-divider">
                      <span>→</span>
                    </div>
                    <div className="comparison-column">
                      <h4>Updated Booking</h4>
                      <div className="booking-details">
                        <p className={isFieldChanged(selectedBooking.room?.name || selectedBooking.roomId, editedBooking.room?.name || editedBooking.roomId) ? 'changed' : ''}>
                          <strong>Room:</strong> {editedBooking.room?.name || editedBooking.roomId}
                        </p>
                        <p className={isFieldChanged(selectedBooking.checkInDate, editedBooking.checkInDate) ? 'changed' : ''}>
                          <strong>Check-in:</strong> {new Date(editedBooking.checkInDate).toLocaleDateString()}
                        </p>
                        <p className={isFieldChanged(selectedBooking.checkOutDate, editedBooking.checkOutDate) ? 'changed' : ''}>
                          <strong>Check-out:</strong> {new Date(editedBooking.checkOutDate).toLocaleDateString()}
                        </p>
                        <p className={isFieldChanged(selectedBooking.guestCount, editedBooking.guestCount) ? 'changed' : ''}>
                          <strong>Guests:</strong> {editedBooking.guestCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowSuccessDialog(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: grid;
          place-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          width: 100%;
          max-width: 1000px;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .booking-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .booking-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .booking-card h3 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .booking-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #3182ce;
          color: white;
          border: none;
        }

        .btn-danger {
          background: #e53e3e;
          color: white;
          border: none;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .modal-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          backdrop-filter: blur(4px);
        }

        .modal-dialog {
          background: white;
          border-radius: 5px;
          width: 100%;
          max-width: 6000px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: modalFadeIn 0.3s ease-out;
        }

        .modal-header {
          padding: 1.5rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
        }

        .close-btn {
          font-size: 1.25rem;
          padding: 0.25rem;
          color: #718096;
          transition: color 0.2s;
        }

        .modal-body {
          padding: 1rem;
        }

        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-control {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }
      `}</style>
    </RoveroLayout>
  );
};

export default UserPage;
