export const fetchAvailableRooms = async (roomId) => { // fetch available rooms
  try {
      const response = await fetch('http://localhost:8080/available-rooms'); // request and check reponse
      if (!response.ok) throw new Error('Failed to fetch available rooms');


      const data = await response.json(); // parse response
      const selectedRoom = data.find(room => room.id === roomId); // find the selected room
      return { availableRooms: data, selectedRoom: selectedRoom || null };
  } catch (error) { // handle response error
      console.error('Error fetching available rooms:', error);
      throw new Error('Could not load available rooms.');
  }
};
