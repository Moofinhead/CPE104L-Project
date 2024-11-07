"use client";
import { useState, useEffect } from 'react';

const EditBookingForm = ({ 
  editedBooking, 
  onSubmit, 
  onClose, 
  availableRooms,
  setAvailableRooms,
  maxGuests 
}) => {
  const [formData, setFormData] = useState({
    roomId: editedBooking.roomId,
    checkInDate: editedBooking.checkInDate,
    checkOutDate: editedBooking.checkOutDate,
    guestCount: editedBooking.guestCount
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      if (formData?.checkInDate && formData?.checkOutDate) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:8080/available-rooms?` +
            `checkInDate=${formData.checkInDate}&` +
            `checkOutDate=${formData.checkOutDate}`
          );
          if (!response.ok) throw new Error('Failed to fetch rooms');
          const rooms = await response.json();
          
          const currentRoomIncluded = rooms.some(room => room.id === editedBooking.roomId);
          if (!currentRoomIncluded) {
            const currentRoom = await fetch(`http://localhost:8080/admin/rooms/${editedBooking.roomId}`);
            if (currentRoom.ok) {
              const roomData = await currentRoom.json();
              rooms.push(roomData);
            }
          }
          
          setAvailableRooms(rooms);
        } catch (error) {
          console.error('Error:', error);
          setError('Failed to fetch available rooms');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRooms();
  }, [formData?.checkInDate, formData?.checkOutDate, editedBooking.roomId, setAvailableRooms]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleDateChange = (field, value) => {
    setFormData(prev => {
      const newBooking = { ...prev, [field]: value };
      
      if (field === 'checkInDate' && newBooking.checkOutDate) {
        const checkIn = new Date(value);
        const checkOut = new Date(newBooking.checkOutDate);
        
        if (checkOut <= checkIn) {
          const nextDay = new Date(checkIn);
          nextDay.setDate(nextDay.getDate() + 1);
          newBooking.checkOutDate = nextDay.toISOString().split('T')[0];
        }
      }
      
      if (field === 'checkOutDate' && newBooking.checkInDate) {
        const checkIn = new Date(newBooking.checkInDate);
        const checkOut = new Date(value);
        
        if (checkOut <= checkIn) {
          return prev;
        }
      }
      
      return newBooking;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'checkInDate' || name === 'checkOutDate') {
      handleDateChange(name, value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      roomId: formData.roomId,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guestCount: formData.guestCount
    });
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Booking Details</h3>
            <button 
              className="close-btn" 
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
              <div>Loading available rooms...</div>
            ) : (
              <>
                <div className="form-group">
                  <label>Room Type</label>
                  <select 
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    className="form-control"
                  >
                    {availableRooms.map(room => {
                      const isAvailable = room.isAvailable || room.id === editedBooking.roomId;
                      return (
                        <option 
                          key={room.id} 
                          value={room.id}
                          disabled={!isAvailable}
                        >
                          {room.name || room.type} 
                          {!isAvailable && room.id !== editedBooking.roomId && " (Not Available for those days)"}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    min={minDate}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    min={minDate}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    min="1"
                    max={maxGuests}
                    className="form-control"
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={loading || !formData?.roomId || !formData?.checkInDate || !formData?.checkOutDate || !formData?.guestCount}
            >
              Save Changes
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        }

        .modal-dialog {
          background: white;
          border-radius: 12px;
          width: 95%;
          max-width: 600px;
          position: relative;
          z-index: 1051;
        }

        .modal-content {
          position: relative;
          background: white;
          border-radius: 12px;
          padding: 20px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default EditBookingForm; 