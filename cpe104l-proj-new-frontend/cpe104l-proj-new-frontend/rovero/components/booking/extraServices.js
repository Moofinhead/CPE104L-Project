//! EXCLUDED FROM PROJECT PRESENTATION DUE TO LIMITED TIME
export const ExtraServicesSection = ({ addons, handleAddonChange }) => (
  <div className="booking-extra-service bp-cnt-ex-ser rp-service mt-50">
    <h2 className="mb-30">Add Extra Service</h2>
    <ul>
      {Object.entries(addons).map(([key, value]) => (
        <li key={key}>
          <div className="d-flex mb-10 align-items-center">
            {key === 'view' ? (
              <ViewService value={value} handleAddonChange={handleAddonChange} />
            ) : (
              <ServiceOption label={key} value={value} handleAddonChange={handleAddonChange} />
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const ServiceOption = ({ label, value, handleAddonChange }) => (
  <>
    <input
      type="checkbox"
      className="option-input radio"
      name={label}
      checked={value}
      onChange={(e) => handleAddonChange(label, e.target.checked)}
    />
    <span className="ml-20 main-color">{label.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} : $10 (Room / Night)</span>
  </>
);

const ViewService = ({ value, handleAddonChange }) => (
  <div className="w-100">
    <input
      type="checkbox"
      className="option-input radio"
      name="add-view"
      checked={value}
      onChange={(e) => handleAddonChange('view', e.target.checked ? 'River View' : '')}
    />
    <span className="ml-20 main-color">Add View : $10 (Room / Night)</span>
    {value && (
      <select className="form-select mt-2 ml-4" value={value} onChange={(e) => handleAddonChange('view', e.target.value)}>
        <option value="River View">River View</option>
        <option value="Forest View">Forest View</option>
      </select>
    )}
  </div>
);