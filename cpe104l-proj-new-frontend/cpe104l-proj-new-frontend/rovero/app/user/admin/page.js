"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoveroLayout from "@/layouts/RoveroLayout";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  zoomPlugin
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from "@/components/Breadcrumb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ email: '', is_admin: false, password: '', username: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    id: '',
    type: '',
    basePrice: '',
    maxGuests: 0,
    bookings: []
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [roomBookingStats, setRoomBookingStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDates, setBookingDates] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    name: '',
    minimum: {
      numberOfNights: '',
      guestCount: '',
      total: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: ''
    },
    flatDiscount: '',
    discountRate: ''
  });
  const [roomFilter, setRoomFilter] = useState('all');
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    averageBookingValue: 0,
    occupancyRate: 0,
    popularRoomTypes: [],
    averageStayDuration: 0,
    shortestStay: 0,
    longestStay: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1))); // Default to last month

  useEffect(() => {
    if (!user || !user.is_admin) {
      router.push('/login');
    } else {
      fetchRooms();
      fetchBookings();
      fetchUsers();
      fetchRoomBookingStats();
      fetchBookingDates();
      fetchCoupons();
      fetchSalesData();
    }
  }, [user, router]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoomBookingStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/room-booking-stats');
      if (!response.ok) throw new Error('Failed to fetch room booking stats');
      const data = await response.json();
      setRoomBookingStats(data);
    } catch (error) {
      console.error('Error fetching room booking stats:', error);
    }
  };

  const fetchBookingDates = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/booking-dates');
      if (!response.ok) throw new Error('Failed to fetch booking dates');
      const data = await response.json();
      setBookingDates(data);
    } catch (error) {
      console.error('Error fetching booking dates:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/coupons');
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/bookings');
      if (!response.ok) throw new Error('Failed to fetch sales data');
      const bookings = await response.json();
      
      // Process bookings into sales data
      const salesByDate = bookings.reduce((acc, booking) => {
        const date = booking.checkInDate.split('T')[0];
        if (!acc[date]) acc[date] = 0;
        acc[date] += booking.priceDetails?.total || 0;
        return acc;
      }, {});

      // Convert to array format for chart
      const formattedData = Object.entries(salesByDate)
        .map(([date, amount]) => ({
          date,
          amount
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setSalesData(formattedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setSalesData([]);
    }
  };

  const handleAddRoom = () => {
    setModalAction('add');
    setRoomForm({
      id: '',
      type: '',
      basePrice: '',
      maxGuests: getDefaultMaxGuests('Standard Room'),
      bookings: []
    });
    setShowModal(true);
  };

  const getDefaultMaxGuests = (roomType) => {
    switch (roomType) {
      case 'Penthouse':
        return 7;
      case 'Luxury Room':
        return 5;
      default: // Standard Room
        return 3;
    }
  };

  const handleEditRoom = (room) => {
    setModalAction('edit');
    setSelectedRoom(room);
    setRoomForm({ id: room.id, type: room.type, basePrice: room.basePrice });
    setShowModal(true);
  };

  const handleDeleteRoom = (roomId) => {
    setModalAction('delete');
    setSelectedRoom({ id: roomId });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setModalAction('addUser');
    setUserForm({ email: '', is_admin: false, password: '', username: '' });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalAction('editUser');
    setSelectedItem(user);
    setUserForm({
      email: user.email,
      is_admin: user.is_admin || false,
      username: user.username || '',
      password: '' // Don't populate password for security
    });
    setShowModal(true);
  };

  const handleDeleteUser = (email) => {
    setModalAction('deleteUser');
    setSelectedItem({ email });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (modalAction === 'add') {
      try {
        // Validate required fields first
        if (!roomForm.id || !roomForm.type || !roomForm.basePrice) {
          throw new Error('Please fill in all required fields');
        }

        // Format the room data exactly as server expects
        const roomData = {
          id: roomForm.id,
          type: roomForm.type,
          basePrice: parseInt(roomForm.basePrice),
          maxGuests: getDefaultMaxGuests(roomForm.type),
          bookings: []
        };

        console.log('Sending room data:', roomData); // For debugging

        const response = await fetch('http://localhost:8080/admin/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(roomData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add room');
        }

        await fetchRooms();
        setShowModal(false);
      } catch (error) {
        console.error('Error adding room:', error);
        alert(error.message);
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete booking');
      fetchRooms(); // Refresh the room list
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      name: '',
      minimum: {
        numberOfNights: '',
        guestCount: '',
        total: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: ''
      },
      flatDiscount: '',
      discountRate: ''
    });
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      name: coupon.name,
      minimum: { ...coupon.minimum },
      flatDiscount: coupon.flatDiscount || '',
      discountRate: coupon.discountRate ? (coupon.discountRate * 100).toString() : ''
    });
    setShowCouponModal(true);
  };

  const handleCouponSubmit = async () => {
    try {
      const method = editingCoupon ? 'PUT' : 'POST';
      const url = editingCoupon 
        ? `http://localhost:8080/admin/coupons/${editingCoupon.name}`
        : 'http://localhost:8080/admin/coupons';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...couponForm,
          discountRate: couponForm.discountRate ? parseFloat(couponForm.discountRate) / 100 : undefined
        })
      });

      if (!response.ok) throw new Error('Failed to save coupon');
      
      fetchCoupons(); // Refresh the coupon list
      setShowCouponModal(false);
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleDeleteCoupon = async (couponName) => {
    if (window.confirm(`Are you sure you want to delete the coupon "${couponName}"?`)) {
      try {
        const response = await fetch(`http://localhost:8080/admin/coupons/${couponName}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete coupon');
        
        fetchCoupons(); // Refresh the coupon list
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const renderCouponRequirements = (minimum) => {
    console.log('Rendering minimum for:', JSON.stringify(minimum, null, 2));
    if (!minimum || Object.keys(minimum).length === 0) return 'No minimum requirements';

    return (
      <ul className="list-unstyled">
        {minimum.numberOfNights && <li>Minimum nights: {minimum.numberOfNights}</li>}
        {minimum.guestCount && <li>Minimum guests: {minimum.guestCount}</li>}
        {minimum.total && <li>Minimum total: ${minimum.total}</li>}
        {minimum.roomId && <li>Specific room: {minimum.roomId}</li>}
        {minimum.checkInDate && minimum.checkOutDate && (
          <li>Valid dates: {minimum.checkInDate} to {minimum.checkOutDate}</li>
        )}
      </ul>
    );
  };

  const renderDiscount = (coupon) => {
    console.log('Rendering discount for:', JSON.stringify(coupon, null, 2));
    if (coupon.flatDiscount) {
      return `Flat $${coupon.flatDiscount} per night`;
    } else if (coupon.discountRate) {
      return `${(coupon.discountRate * 100).toFixed(0)}%`;
    }
    return 'N/A';
  };

  const renderCouponsTab = () => {
    return (
      <div className="coupons-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Coupons</h2>
          <Button variant="primary" onClick={handleAddCoupon}>Add Coupon</Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Minimum Requirements</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.name}>
                <td>{coupon.name}</td>
                <td>{renderCouponRequirements(coupon.minimum)}</td>
                <td>{renderDiscount(coupon)}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditCoupon(coupon)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCoupon(coupon.name)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showCouponModal} onHide={() => setShowCouponModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={couponForm.name} 
                  onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                  disabled={!!editingCoupon}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Minimum Nights</Form.Label>
                <Form.Control 
                  type="number" 
                  value={couponForm.minimum.numberOfNights} 
                  onChange={(e) => setCouponForm({...couponForm, minimum: {...couponForm.minimum, numberOfNights: e.target.value}})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Minimum Guests</Form.Label>
                <Form.Control 
                  type="number" 
                  value={couponForm.minimum.guestCount} 
                  onChange={(e) => setCouponForm({...couponForm, minimum: {...couponForm.minimum, guestCount: e.target.value}})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Minimum Total</Form.Label>
                <Form.Control 
                  type="number" 
                  value={couponForm.minimum.total} 
                  onChange={(e) => setCouponForm({...couponForm, minimum: {...couponForm.minimum, total: e.target.value}})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Specific Room ID</Form.Label>
                <Form.Control 
                  type="text" 
                  value={couponForm.minimum.roomId} 
                  onChange={(e) => setCouponForm({...couponForm, minimum: {...couponForm.minimum, roomId: e.target.value}})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Valid From</Form.Label>
                <Form.Control 
                  type="date" 
                  value={couponForm.minimum.checkInDate} 
                  onChange={(e) => setCouponForm({...couponForm, minimum: {...couponForm.minimum, checkInDate: e.target.value}})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Valid To</Form.Label>
                <Form.Control 
                  type="date" 
                  value={couponForm.minimum.checkOutDate} 
                  onChange={(e) => setCouponForm({...couponForm, minimum: {...couponForm.minimum, checkOutDate: e.target.value}})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Flat Discount (per night)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={couponForm.flatDiscount} 
                  onChange={(e) => setCouponForm({...couponForm, flatDiscount: e.target.value, discountRate: ''})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Discount Rate (%)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={couponForm.discountRate} 
                  onChange={(e) => setCouponForm({...couponForm, discountRate: e.target.value, flatDiscount: ''})}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCouponModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCouponSubmit}>
              Save Coupon
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  const isDateRangeOverlapsCurrentDate = (startDate, endDate) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return startDate <= currentDate && endDate >= currentDate;
  };

  const isRoomCurrentlyBooked = (bookings) => {
    if (!bookings || bookings.length === 0) return false;
    return bookings.some(booking => isDateRangeOverlapsCurrentDate(booking.startDate, booking.endDate));
  };

  const getFilteredRooms = () => {
    switch (roomFilter) {
      case 'booked':
        return rooms.filter(room => isRoomCurrentlyBooked(room.bookings));
      case 'available':
        return rooms.filter(room => !isRoomCurrentlyBooked(room.bookings));
      default:
        return rooms;
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'users') {
      return (
        <div>
          <h2>Users</h2>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Admin Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.is_admin ? 'Admin' : 'User'}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.email)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    } else if (activeTab === 'rooms') {
      return (
        <div className="rooms-content">
          <div className="d-flex justify-content-between mb-4">
            <button className="btn btn-primary" onClick={handleAddRoom}>Add Room</button>
            <div className="btn-group">
              {['all', 'booked', 'available'].map(filter => (
                <button
                  key={filter}
                  className={`btn btn-outline-secondary ${roomFilter === filter ? 'active' : ''}`}
                  onClick={() => setRoomFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="room-list">
            {renderRoomsTable()}
          </div>
        </div>
      );
    } else if (activeTab === 'statistics') {
      // Calculate statistics from bookings data
      const totalRevenue = bookings.reduce((sum, booking) => 
        sum + (parseFloat(booking.priceDetails?.total) || 0), 0);

      const averageBookingValue = bookings.length > 0 ? 
        totalRevenue / bookings.length : 0;

      // Calculate occupancy rate per room
      const calculateOccupancyRate = () => {
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Count rooms that are currently occupied
        const occupiedRooms = rooms.filter(room => {
          if (!room.bookings || !Array.isArray(room.bookings)) return false;
          
          return room.bookings.some(booking => {
            // Make sure we're using the correct property names from your booking object
            const startDate = booking.startDate || booking.checkInDate;
            const endDate = booking.endDate || booking.checkOutDate;
            
            // Debug logging
            console.log('Room:', room.id, 'Booking dates:', startDate, endDate, 'Current:', currentDateStr);
            
            if (!startDate || !endDate) return false;
            
            // Compare dates as strings in YYYY-MM-DD format
            return startDate <= currentDateStr && endDate >= currentDateStr;
          });
        }).length;

        // Calculate percentage and ensure we have rooms
        const totalRooms = rooms.length;
        console.log('Occupied rooms:', occupiedRooms, 'Total rooms:', totalRooms);
        
        return totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
      };

      const calculateAverageStay = () => {
        let totalDays = 0;
        let validBookings = 0;
        
        bookings.forEach(booking => {
          if (booking.checkInDate && booking.checkOutDate) {
            const start = new Date(booking.checkInDate);
            const end = new Date(booking.checkOutDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (!isNaN(days) && days > 0) {
              totalDays += days;
              validBookings++;
            }
          }
        });
        
        return validBookings > 0 ? totalDays / validBookings : 0;
      };

      // Room distribution data
      const roomBookingCounts = rooms.reduce((acc, room) => {
        acc[room.id] = (room.bookings?.length || 0);
        return acc;
      }, {});

      const roomDistributionData = {
        labels: Object.keys(roomBookingCounts),
        datasets: [{
          label: 'Bookings per Room',
          data: Object.values(roomBookingCounts),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };

      // Room type distribution data
      const roomTypeDistribution = rooms.reduce((acc, room) => {
        acc[room.type] = (acc[room.type] || 0) + 1;
        return acc;
      }, {});

      const pieChartData = {
        labels: Object.keys(roomTypeDistribution),
        datasets: [{
          data: Object.values(roomTypeDistribution),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',  // Pink for Standard Room
            'rgba(54, 162, 235, 0.5)',  // Blue for Luxury Room
            'rgba(255, 206, 86, 0.5)'   // Yellow for Penthouse
          ]
        }]
      };

      const aggregateRevenueData = (data, range) => {
        const aggregated = {};
        
        data.forEach(item => {
          if (!item.date) return; // Skip if no date
          
          let dateKey;
          // Ensure proper date object creation
          const date = new Date(item.date);
          if (isNaN(date.getTime())) return; // Skip invalid dates
          
          switch(range) {
            case 'day':
              dateKey = date.toISOString().split('T')[0];
              break;
            case 'week':
              try {
                // Get the first day of the week (Sunday)
                const weekStart = new Date(date);
                weekStart.setHours(0, 0, 0, 0);
                weekStart.setDate(date.getDate() - date.getDay());
                dateKey = weekStart.toISOString().split('T')[0];
              } catch (e) {
                console.error('Error processing week date:', e);
                dateKey = date.toISOString().split('T')[0];
              }
              break;
            case 'month':
              dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2, '0')}`;
              break;
            case 'year':
              dateKey = `${date.getFullYear()}`;
              break;
            default:
              dateKey = date.toISOString().split('T')[0];
          }
          
          if (dateKey) {
            aggregated[dateKey] = (aggregated[dateKey] || 0) + (Number(item.amount) || 0);
          }
        });

        // Sort the dates
        return Object.entries(aggregated)
          .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
          .map(([date, amount]) => ({ date, amount }));
      };

      return (
        <div className="statistics-content">
          <h2 className="text-center mb-4">Dashboard Statistics</h2>
          
          {/* Key Metrics Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white" 
                   title="Total revenue from all bookings made in the system">
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <h3>₱{totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white"
                   title="Average amount spent per booking (Total Revenue ÷ Number of Bookings)">
                <div className="card-body">
                  <h5 className="card-title">Average Booking Value</h5>
                  <h3>₱{averageBookingValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white"
                   title="Percentage of rooms currently occupied (Number of Occupied Rooms ÷ Total Rooms × 100)">
                <div className="card-body">
                  <h5 className="card-title">Current Occupancy Rate</h5>
                  <h3>{calculateOccupancyRate().toFixed(1)}%</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-dark"
                   title="Average length of stay per booking (Total Nights Booked ÷ Number of Bookings)">
                <div className="card-body">
                  <h5 className="card-title">Average Stay</h5>
                  <h3>{calculateAverageStay().toFixed(1)} nights</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="card-title">Revenue Over Time</h3>
                    <div className="d-flex gap-3">
                      <select 
                        className="form-select" 
                        value={dateRange} 
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ width: 'auto' }}
                      >
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                      <input
                        type="date"
                        className="form-control"
                        value={startDate.toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        style={{ width: 'auto' }}
                      />
                    </div>
                  </div>
                  <div className="chart-scroll-container">
                    <div className="chart-wrapper">
                      <Line
                        data={{
                          labels: aggregateRevenueData(salesData, dateRange)
                            .filter(d => {
                              try {
                                const dataDate = new Date(d.date);
                                return !isNaN(dataDate.getTime()) && dataDate >= startDate;
                              } catch (e) {
                                console.error('Error filtering date:', e);
                                return false;
                              }
                            })
                            .map(d => {
                              try {
                                const date = new Date(d.date);
                                if (isNaN(date.getTime())) return 'Invalid Date';
                                
                                switch(dateRange) {
                                  case 'day':
                                    return date.toLocaleDateString();
                                  case 'week':
                                    return `Week of ${date.toLocaleDateString()}`;
                                  case 'month':
                                    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
                                  case 'year':
                                    return date.getFullYear().toString();
                                  default:
                                    return date.toLocaleDateString();
                                }
                              } catch (e) {
                                console.error('Error formatting date:', e);
                                return 'Invalid Date';
                              }
                            }),
                          datasets: [{
                            label: 'Revenue',
                            data: aggregateRevenueData(salesData, dateRange)
                              .filter(d => {
                                const dataDate = new Date(d.date);
                                return !isNaN(dataDate.getTime()) && dataDate >= startDate;
                              })
                              .map(d => d.amount),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                autoSkip: false // Prevent automatic tick skipping
                              }
                            },
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: value => `₱${value.toLocaleString()}`
                              }
                            }
                          },
                          plugins: {
                            zoom: {
                              zoom: {
                                wheel: {
                                  enabled: true,
                                },
                                pinch: {
                                  enabled: true
                                },
                                mode: 'x',
                              },
                              pan: {
                                enabled: true,
                                mode: 'x',
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add these styles to your CSS */}
          <style jsx>{`
            .chart-scroll-container {
              width: 100%;
              overflow-x: scroll;
              overflow-y: hidden;
              padding-bottom: 15px; /* Space for scrollbar */
            }

            .chart-wrapper {
              min-width: 1200px; /* Force horizontal scroll */
              height: 300px;
            }

            /* Scrollbar styling */
            .chart-scroll-container::-webkit-scrollbar {
              height: 10px;
              background-color: #F5F5F5;
            }

            .chart-scroll-container::-webkit-scrollbar-thumb {
              background-color: #888;
              border-radius: 5px;
            }

            .chart-scroll-container::-webkit-scrollbar-track {
              background-color: #F5F5F5;
              border-radius: 5px;
            }

            /* For Firefox */
            .chart-scroll-container {
              scrollbar-width: thin;
              scrollbar-color: #888 #F5F5F5;
            }
          `}</style>

          {/* Booking Distribution by Room */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Bookings by Room</h3>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={roomDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Type Distribution and Recent Bookings */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Room Type Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Recent Bookings</h3>
                  <div className="recent-bookings">
                    {bookings.slice(-5).reverse().map(booking => (
                      <div key={booking.bookingId} className="booking-item border-bottom py-2">
                        <div className="d-flex justify-content-between">
                          <span>Room {booking.roomId}</span>
                          <span className="text-muted">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small>
                            {rooms.find(r => r.id === booking.roomId)?.type || 'Unknown Room Type'}
                          </small>
                          <small className="text-muted">
                            ₱{(booking.priceDetails?.total || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Popular Rooms */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Most Popular Room Types</h3>
                  <div className="popular-rooms">
                    {[...new Set(rooms.map(room => room.type))].map(type => ({
                      type,
                      count: bookings.filter(booking => 
                        rooms.find(r => r.id === booking.roomId)?.type === type
                      ).length
                    }))
                    .sort((a, b) => b.count - a.count)
                    .map(({ type, count }) => (
                      <div key={type} className="room-popularity-item border-bottom py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{type}</span>
                          <span className="badge bg-primary">
                            {count} bookings
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'coupons') {
      return renderCouponsTab();
    }
    // ... other tabs implementation
  };

  const calculateAverageBookingDuration = () => {
    // This is a placeholder. You should implement the actual calculation based on your data.
    return 3.5;
  };

  const findMostPopularRoomType = () => {
    // This is a placeholder. You should implement the actual calculation based on your data.
    return 'Deluxe Suite';
  };

  const isSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  const renderRoomsTable = () => (
    <table className="table">
      <thead>
        <tr>
          <th>Room ID</th>
          <th>Type</th>
          <th>Base Price</th>
          <th>Status</th>
          <th>Booking ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {getFilteredRooms().map(room => (
          <tr key={room.id}>
            <td>{room.id}</td>
            <td>{room.type}</td>
            <td>${room.basePrice}</td>
            <td>
              <span className={`badge ${isRoomCurrentlyBooked(room.bookings) ? 'bg-danger' : 'bg-success'}`}>
                {isRoomCurrentlyBooked(room.bookings) ? 'Booked' : 'Available'}
              </span>
            </td>
            <td>
              {room.bookings && room.bookings.length > 0 ? (
                <div className="booking-list">
                  {room.bookings.map((booking, index) => (
                    <div key={booking.bookingId} className="booking-item">
                      <div className="booking-dates text-muted">
                        {booking.startDate} - {booking.endDate}
                      </div>
                      <div className="booking-id-container d-flex align-items-center">
                        <span className="booking-id">{booking.bookingId}</span>
                        <button 
                          className="btn btn-sm btn-danger ms-2" 
                          onClick={() => handleDeleteBooking(booking.bookingId)}
                        >
                          X
                        </button>
                      </div>
                      {index < room.bookings.length - 1 && <hr className="my-2" />}
                    </div>
                  ))}
                </div>
              ) : (
                'N/A'
              )}
            </td>
            <td>
              <button 
                className="btn btn-sm btn-outline-primary me-2" 
                onClick={() => handleEditRoom(room)}
              >
                Edit
              </button>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => handleDeleteRoom(room.id)}
                disabled={isRoomCurrentlyBooked(room.bookings)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="admin"
        pageTitle={`Welcome, Admin ${user?.nickname || ''}`}
        pageSubTitle="This is your admin dashboard."
      />
      <div className="admin-page-area mt-120 mb-120">
        <div className="container">          
          <div className="admin-tabs mt-5 mb-4">
            <ul className="nav nav-tabs">
              {['rooms', 'users', 'coupons', 'statistics'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-dashboard">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction.includes('User') && modalAction !== 'deleteUser' ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})} 
                  disabled={modalAction === 'editUser'}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={userForm.username} 
                  onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={userForm.password} 
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Is Admin" 
                  checked={userForm.is_admin}
                  onChange={(e) => setUserForm({...userForm, is_admin: e.target.checked})}
                />
              </Form.Group>
            </Form>
          ) : modalAction === 'deleteUser' ? (
            <p>Are you sure you want to delete this user?</p>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Room ID</Form.Label>
                <Form.Control
                  type="text"
                  value={roomForm.id}
                  onChange={(e) => setRoomForm({ ...roomForm, id: e.target.value })}
                  placeholder="e.g., standard-011"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={roomForm.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setRoomForm({
                      ...roomForm,
                      type: newType,
                      maxGuests: getDefaultMaxGuests(newType)
                    });
                  }}
                >
                  <option value="">Select room type</option>
                  <option value="Standard Room">Standard Room</option>
                  <option value="Luxury Room">Luxury Room</option>
                  <option value="Penthouse">Penthouse</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Base Price</Form.Label>
                <Form.Control
                  type="number"
                  value={roomForm.basePrice}
                  onChange={(e) => setRoomForm({ ...roomForm, basePrice: e.target.value })}
                  placeholder="Enter base price"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            {modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>
    </RoveroLayout>
  );
};

export default AdminPage;

