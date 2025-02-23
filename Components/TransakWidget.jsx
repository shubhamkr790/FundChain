import React, { useState } from 'react';

const TransakWidget = ({ apiKey }) => {
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const walletAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  const handleDonateClick = () => {
    setShowModal(true);
  };

  const handleConfirmClick = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount in INR");
      return;
    }

    const transakUrl = `https://global-stg.transak.com?apiKey=${encodeURIComponent(apiKey)}&defaultCryptoCurrency=ETH&walletAddress=${encodeURIComponent(walletAddress)}&themeColor=000000&fiatCurrency=INR&redirectURL=${encodeURIComponent(window.location.origin)}&defaultAmount=${encodeURIComponent(amount)}`;

    window.open(transakUrl, '_blank');
    setShowModal(false);
  };

  return (
    <>
      <button onClick={handleDonateClick} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" }}>
        INR
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter Amount</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in INR"
            />
            <button onClick={handleConfirmClick} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" }}>
              Confirm
            </button>
            <button onClick={() => setShowModal(false)} style={{ padding: "5px 10px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransakWidget;
