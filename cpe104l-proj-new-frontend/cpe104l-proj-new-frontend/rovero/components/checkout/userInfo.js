export const UserInfo = ({ userInfo, additionalMessage }) => {
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div className="checkout-your-info-area mt-40">
      <h2 className="mb-30">Your Information</h2>
      <ul>
        {Object.entries(userInfo).map(([key, value]) => {
          if (key === "cuponCode") return null; // skip cuponCode
          return (
            <li key={key} className="text-color d-inline-block mb-15">
              <span className="main-color d-inline-block">
                {`${capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1'))} :`}
              </span>{" "}
              {value}
            </li>
          ); // format key names, show user info
        })}
      </ul>
      {additionalMessage && (
        <ul>
          <li className="d-block mb-15 w-100">
            <span>Additional message :</span>
            <p className="mb-0 mt-2">{additionalMessage}</p>
          </li>
        </ul>
      )} {/* show additional message if provided */}
    </div>
  );
};