export const UserSidebar = ({ onLogout, onDeleteAccount, activeTab, setActiveTab }) => (
  <div className="col-md-3">
    <div className="user-sidebar">
      <ul className="list-unstyled">
        <li className={`mb-2 ${activeTab === 'profile' ? 'active' : ''}`}>
          <button className="btn btn-link" onClick={() => setActiveTab('profile')}>Profile</button>
        </li>
        <li className={`mb-2 ${activeTab === 'bookings' ? 'active' : ''}`}>
          <button className="btn btn-link" onClick={() => setActiveTab('bookings')}>My Bookings</button>
        </li>
        <li className="mb-2">
          <button className="btn btn-link text-danger" onClick={onDeleteAccount}>Delete Account</button>
        </li>
        <li className="mb-2">
          <button className="btn btn-link" onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  </div>
);
