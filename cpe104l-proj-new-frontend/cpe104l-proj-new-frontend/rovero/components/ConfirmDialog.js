"use client";

const ConfirmDialog = ({ onConfirm, onClose }) => {
  return (
    <div className="modal-wrapper">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Booking</h3>
            <button 
              className="close-btn" 
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to edit this booking?</p>
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-primary" 
              onClick={onConfirm}
            >
              Yes, Edit Booking
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }

        .modal-dialog {
          background: white;
          border-radius: 12px;
          width: 95%;
          max-width: 600px;
          position: relative;
          z-index: 1051;
        }

        .modal-content {
          position: relative;
          background: white;
          border-radius: 12px;
          padding: 20px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
