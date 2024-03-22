import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function NewLoanModal({
  showModal,
  setShowModal,
  handleSubmit,
  amount,
  handleAmountChange,
  tenure,
  handleTenureChange,
  error,
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Loan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div>
            <label htmlFor="tenure">Tenure (in months):</label>
            <input
              type="number"
              id="tenure"
              name="tenure"
              value={tenure}
              onChange={handleTenureChange}
            />
          </div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </form>
        {error && <div className="error">{error}</div>}
      </Modal.Body>
    </Modal>
  );
}

export default NewLoanModal;
