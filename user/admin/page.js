"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoveroLayout from "@/layouts/RoveroLayout";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [roomForm, setRoomForm] = useState({ id: '', type: '', basePrice: '' });
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

  const handleAddRoom = () => {
    setModalAction('add');
    setRoomForm({ id: '', type: '', basePrice: '' });
    setShowModal(true);
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
    setUserForm({ ...user, password: '' }); // Don't populate password for security reasons
    setShowModal(true);
  };

  const handleDeleteUser = (email) => {
    setModalAction('deleteUser');
    setSelectedItem({ email });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      let response;
      if (modalAction === 'addUser') {
        response = await fetch('http://localhost:8080/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm)
        });
      } else if (modalAction === 'editUser') {
        response = await fetch(`http://localhost:8080/admin/users/${selectedItem.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm)
        });
      } else if (modalAction === 'deleteUser') {
        response = await fetch(`http://localhost:8080/admin/users/${selectedItem.email}`, {
          method: 'DELETE'
        });
      } else if (modalAction === 'add') {
        response = await fetch('http://localhost:8080/admin/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomForm)
        });
      } else if (modalAction === 'edit') {
        response = await fetch(`http://localhost:8080/admin/rooms/${selectedRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomForm)
        });
      } else if (modalAction === 'delete') {
        response = await fetch(`http://localhost:8080/admin/rooms/${selectedRoom.id}`, {
          method: 'DELETE'
        });
      }

      if (!response.ok) throw new Error(`Failed to ${modalAction}`);
      
      if (modalAction.includes('User')) {
        fetchUsers(); // Refresh the user list
      } else {
        fetchRooms(); // Refresh the room list
      }
      setShowModal(false);
    } catch (error) {
      console.error(`Error ${modalAction}:`, error);
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
        <div className="room-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Rooms</h2>
            <div>
              <button className="btn btn-outline-secondary me-2">Export</button>
              <button className="btn btn-primary" onClick={handleAddRoom}>Add Room</button>
            </div>
          </div>
          
          <div className="booking-indicator mb-4">
            <h3>Total Bookings: <span className="badge bg-primary">{bookings.length}</span></h3>
          </div>

          <div className="room-filters mb-4">
            <button className="btn btn-light me-2">All</button>
            <button className="btn btn-light me-2">Booked</button>
            <button className="btn btn-light">Available</button>
          </div>

          <div className="room-list">
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
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.type}</td>
                    <td>${room.basePrice}</td>
                    <td>{room.isBooked ? 'Booked' : 'Available'}</td>
                    <td>
                      {room.bookId || 'N/A'}
                      {room.bookId && (
                        <button 
                          className="btn btn-sm btn-danger ms-2" 
                          onClick={() => handleDeleteBooking(room.bookId)}
                        >
                          X
                        </button>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditRoom(room)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoom(room.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (activeTab === 'statistics') {
      return (
        <div className="statistics-content">
          <h2 className="text-center mb-4">Statistics</h2>
          <div className="row">
            <div className="col-md-8 offset-md-2 mb-5">
              <h3 className="text-center mb-3">Most Booked Rooms</h3>
              <div style={{ height: '400px', position: 'relative' }}>
                <Pie
                  data={{
                    labels: roomBookingStats.map(stat => `Room ${stat.roomId}`),
                    datasets: [{
                      data: roomBookingStats.map(stat => stat.bookingCount),
                      backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                      ],
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-12">
              <h3 className="text-center mb-3">Booking Calendar</h3>
              <div className="d-flex justify-content-center">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={({ date }) => {
                    if (bookingDates.find(dDate => isSameDay(date, new Date(dDate)))) {
                      return 'booked-date';
                    }
                  }}
                  className="w-100"
                  style={{ maxWidth: '800px', margin: '0 auto' }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <h3 className="text-center mb-3">Other Statistics</h3>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Rooms
                  <span className="badge bg-primary rounded-pill">{rooms.length}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Bookings
                  <span className="badge bg-primary rounded-pill">{bookings.length}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Average Booking Duration
                  <span className="badge bg-primary rounded-pill">{calculateAverageBookingDuration()} days</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Most Popular Room Type
                  <span className="badge bg-primary rounded-pill">{findMostPopularRoomType()}</span>
                </li>
              </ul>
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

  return (
    <RoveroLayout>
      <div className="admin-page-area mt-120 mb-120">
        <div className="container">
          <h1>Welcome, Admin {user.nickname}</h1>
          <p>This is your admin dashboard.</p>
          
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
                  onChange={(e) => setRoomForm({...roomForm, id: e.target.value})} 
                  disabled={modalAction === 'edit'}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control 
                  type="text" 
                  value={roomForm.type} 
                  onChange={(e) => setRoomForm({...roomForm, type: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Base Price</Form.Label>
                <Form.Control 
                  type="number" 
                  value={roomForm.basePrice} 
                  onChange={(e) => setRoomForm({...roomForm, basePrice: e.target.value})}
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