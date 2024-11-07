import Link from 'next/link'; 

export const BookingInfoSection = ({ user, userInfo, updateUserInfo, handleBookNow, fetchTotal }) => (
  // display booking information
  <div className="booking-your-info-area mt-40"> 
    <div className="row booking-info-header justify-content-between">
      <div className="col-xl-5"><h2 className="mb-30">Booking Information</h2></div>
      <div className="col-xl-7">
        <div className="booking-login-info w-100">
          {!user && ( // show login link if user is not logged in
            <p className="mb-25 text-md-right">
              Already Registered? <Link href="/login" className="main-color cursor-pointer f-700 ml-2 pb-1">login</Link>
            </p>
          )} 
        </div>
      </div>
    </div>

    {user && <p className="logged-in-message mb-4">You are logged in. Your account information has been prefilled below.</p>} {/* message for logged-in users */}
    <UserInfoForm userInfo={userInfo} updateUserInfo={updateUserInfo} handleBookNow={handleBookNow} fetchTotal={fetchTotal} />
  </div>
);

const UserInfoForm = ({ userInfo, updateUserInfo, handleBookNow, fetchTotal, formErrors }) => {
  return (
    <form onSubmit={handleBookNow} className="checkbox-form">
      <div className="row">
        {['firstName', 'lastName', 'email', 'phoneNo', 'address', 'city', 'country', 'zipCode'].map((field) => (
          <div key={field} className="col-xl-6 px-md-2">
            <input
              type={field === 'email' ? 'email' : 'text'} 
              placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
              className={`w-100 ${formErrors?.[field] ? 'error' : ''}`}
              value={userInfo[field] || ''}
              onChange={(e) => updateUserInfo(field, e.target.value)}
              autoComplete="new-field"
              required
            />
            {formErrors?.[field] && (
              <div className="validation-tooltip">
                {formErrors[field]}
              </div>
            )}
          </div>
        ))}
        
        <div className="col-xl-12 mb-3 px-md-2">
          <textarea
            className="massage w-100 primary-border pl-20 pt-20"
            placeholder="Additional message" 
            value={userInfo.additionalMessage || ''}
            onChange={(e) => updateUserInfo('additionalMessage', e.target.value)}
          />
        </div>
        <div className="col-xl-12 mb-3 px-md-2">
          <input
            type="text"
            placeholder="Coupon Code" 
            className="w-100"
            value={userInfo.couponCode || ''}
            onChange={(e) => updateUserInfo('couponCode', e.target.value)}
            autoComplete="new-coupon"
          />
        </div>
        <div className="col-xl-12 px-md-2">
          <div className='my-btn d-inline-block'>
            <button className="btn theme-bg" type="submit">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};