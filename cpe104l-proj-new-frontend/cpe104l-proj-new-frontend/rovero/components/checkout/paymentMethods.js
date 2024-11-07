export const PaymentMethods = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  const paymentMethods = ["Cash on Spot", "Bank Transfer", "Credit Card", "Paypal"]; // available payment options

  return (
    <div className="payment-method mt-40"> {/* payment methods container */}
      <h2 className="mb-22">Payment Options</h2> {/* section title */}
      <ul>
        {paymentMethods.map((method, index) => ( // iterate over payment methods
          <li key={index}>
            <div className="d-flex align-items-center mb-3"> {/* flex container for checkbox and label */}
              <input 
                type="checkbox" 
                name="paymentMethod" 
                value={method.toLowerCase().replace(' ', '-')} 
                checked={selectedPaymentMethod === method} // check if selected
                onChange={() => setSelectedPaymentMethod(selectedPaymentMethod === method ? null : method)} // toggle selection
              />
              <span className="main-color pl-15">{method}</span> {/* payment method label */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};