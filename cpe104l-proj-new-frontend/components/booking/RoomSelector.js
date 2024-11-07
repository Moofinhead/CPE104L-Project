import React, { useState } from 'react';

const RoomSelector = ({ rooms = [], selectedRoom, onSelectRoom, checkInDate, checkOutDate }) => {
  const [selectedType, setSelectedType] = useState(''); // state to hold the selected room type
  const roomTypes = [...new Set(rooms.map(room => room.name.split(' ')[0]))]; // get unique room types

  if (rooms.length === 0) { // loading if no rooms
    return <div>Loading rooms...</div>; 
  }

  if (!checkInDate || !checkOutDate) {
    return (
      <div className="room-selector">
        <div className="date-not-selected-message">
          Please select check-in and check-out dates to view room availability
        </div>
      </div>
    );
  }

  const formatRoomName = (name) => { // format room name into type and number
    const parts = name.split(/[-\s]/);
    const type = parts[0];
    const number = parts[parts.length - 1];
    return { type, number: number.padStart(2, '0') }; // return formatted room details
  };

  const isRoomAvailable = (room) => { // check if room is available
    if (!checkInDate || !checkOutDate || !room.bookings) return true;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    return !room.bookings.some(booking => {
      const bookingStart = new Date(booking.checkInDate);
      const bookingEnd = new Date(booking.checkOutDate);
      
      // Check if dates overlap
      return (
        (checkIn >= bookingStart && checkIn < bookingEnd) ||
        (checkOut > bookingStart && checkOut <= bookingEnd) ||
        (checkIn <= bookingStart && checkOut >= bookingEnd)
      );
    });
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value); // update selected room type
  };

  return (
    <div className="room-selector">
      <select 
        className="room-type-selector" // dropdown room types
        onChange={handleTypeChange} // handle type selection change
      >
        <option value="">All Room Types</option>
        {roomTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select> {/* end room type selector */}
      
      <div className="hotel-floor"> {/* container for displaying rooms */}
        {rooms
          .filter(room => 
            !selectedType || room.name.startsWith(selectedType) // filter rooms based on selected type
          )
          .map((room) => {
            const { type, number } = formatRoomName(room.name); // format room details
            const available = isRoomAvailable(room); // check availability
            return (
              <button
                key={room.id}
                className={`room ${selectedRoom === room.id ? 'selected' : ''} ${available ? 'available' : 'unavailable'}`} // button style based on selection and availability
                onClick={() => available && onSelectRoom(room.id)} // select room if available
                disabled={!available} // disable button if room is unavailable
              >
                <div className="room-type">{type}</div> {/* display room type */}
                <div className="room-number">{number}</div> {/* display room number */}
                {!available && (
                  <div className="room-unavailable-text">
                    Not available for selected dates
                  </div>
                )}
              </button> // end of room button
            );
          })}
      </div> {/* end container */}
    </div>
  );
};

export default RoomSelector;
