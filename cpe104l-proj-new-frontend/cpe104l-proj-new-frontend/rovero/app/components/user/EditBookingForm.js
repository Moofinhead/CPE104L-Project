import React, { useState, useEffect } from 'react';

const EditBookingForm = ({ editedBooking, onSubmit, onClose }) => {
  const [localEditedBooking, setLocalEditedBooking] = useState(editedBooking);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxGuests, setMaxGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);

  // Fetch max guests when room changes
  useEffect(() => {
    const fetchMaxGuests = async () => {
      if (localEditedBooking?.roomId) {
        try {
          const response = await fetch(
            `http://localhost:8080/get-max-guests?roomId=${localEditedBooking.roomId}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch max guests');
          }
          
          const data = await response.json();
          console.log('Max guests response:', data);
          setMaxGuests(data.maxGuests);
          
          // Adjust guest count if it exceeds new max
          if (localEditedBooking.guestCount > data.maxGuests) {
            setLocalEditedBooking(prev => ({
              ...prev,
              guestCount: data.maxGuests
            }));
          }
        } catch (error) {
          console.error('Error fetching max guests:', error);
          setError('Failed to fetch room capacity');
        }
      }
    };

    fetchMaxGuests();
  }, [localEditedBooking?.roomId]);

  // Room selection handler
  const handleRoomChange = (e) => {
    const newRoomId = e.target.value;
    setLocalEditedBooking(prev => ({
      ...prev,
      roomId: newRoomId,
      guestCount: 1 // Reset to 1 when room changes
    }));
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-dialog">
        <div className="modal-content">
          {/* ... other form elements ... */}
          
          <div className="form-group">
            <label>Room Type</label>
            <select 
              className="form-control"
              value={localEditedBooking?.roomId || ''}
              onChange={handleRoomChange}
            >
              <option value="">Select a room</option>
              {availableRooms.map((room) => (
                <option 
                  key={room.id} 
                  value={room.id}
                  disabled={!room.isAvailable}
                >
                  {room.name} {!room.isAvailable ? '(Not Available)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Number of Guests</label>
            <input
              type="number"
              className="form-control"
              value={localEditedBooking?.guestCount || 1}
              min={1}
              max={maxGuests}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= maxGuests) {
                  setLocalEditedBooking(prev => ({
                    ...prev,
                    guestCount: value
                  }));
                }
              }}
            />
            <small className="text-muted">
              Maximum guests allowed: {maxGuests}
            </small>
          </div>

          {/* ... rest of the form ... */}
        </div>
      </div>
    </div>
  );
};

export default EditBookingForm; 