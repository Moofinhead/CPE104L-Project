export const GuestCountInput = ({ guestCount, maxGuests, updateGuestCount }) => (
  <div className="d-flex justify-content-between mt-4">
    <span>Guest Count:</span>
    <div>
      <button type="button" onClick={() => updateGuestCount(Math.max(guestCount - 1, 1))}>-</button> {/* decrease guest count */}
      <span className="mx-2">{guestCount}</span> {/* displays the current guest count */}
      <button type="button" onClick={() => updateGuestCount(Math.min(guestCount + 1, maxGuests))}>+</button> {/* increase guest count */}
    </div>
  </div>
);
