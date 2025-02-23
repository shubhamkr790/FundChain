import React, { useState } from "react";
import { ethers } from "ethers";
import TransakWidget from './TransakWidget';

const Card = ({ title, allcampaign, setOpenModel, setDonate }) => {
  const [showEthModal, setShowEthModal] = useState(false);
  const [ethAmount, setEthAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays.toFixed(0);
  };

  const handleEthDonateClick = (campaign) => {
    setSelectedCampaign({ ...campaign, walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" });
    setShowEthModal(true);
  };

  const handleEthConfirmClick = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to proceed.");
      return;
    }

    if (!selectedCampaign || !selectedCampaign.walletAddress) {
      alert("Invalid campaign selected or missing wallet address.");
      return;
    }

    try {
      console.log("Selected Campaign:", selectedCampaign);
      console.log("Wallet Address:", selectedCampaign.walletAddress);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      const formattedAddress = ethers.utils.getAddress(selectedCampaign.walletAddress); // Ensure valid address

      const transactionParameters = {
        to: formattedAddress,
        from: account,
        value: ethers.utils.parseEther(ethAmount).toHexString(),
      };

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setShowEthModal(false);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <h2>{title}</h2>
      <div className="grid gap-5 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
        {allcampaign && allcampaign.map((campaign, index) => (
          <div
            key={index}
            className="cursor-pointer border overflow-hidden transition-shadow duration-300 bg-white rounded"
          >
            <img
              src={campaign.image}
              className="object-cover w-full h-64 rounded"
              alt={campaign.title}
            />

            <div className="py-5 pl-2">
              <p className=" mb-2 text-xs font-semibold text-gray-600 uppercase">
                Days Left: {daysLeft(campaign.deadline)}
              </p>
              <a
                href="/"
                aria-label="Article"
                className="inline-block mb-3 text-black transition-colors duration-200 hover:text-deep-purple-accent-700"
              >
                <p className="text-2xl font-bold leading-5">{campaign.title}</p>
              </a>
              <p className="mb-4 text-gray-700">{campaign.description}</p>
              <div className="flex space-x-4">
                <p className="font-semibold"> Target: {campaign.target} ETH</p>

                <p className="font-semibold">
                  Raised: {campaign.amountCollected} ETH
                </p>
              </div>
              <button onClick={() => handleEthDonateClick(campaign)} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" }}>
                Donate in ETH
              </button>
              <TransakWidget apiKey="b1a4a892-5db6-45c9-a8eb-47aa6f80e343" walletAddress={campaign.walletAddress} />
            </div>
          </div>
        ))}
      </div>

      {showEthModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter ETH Amount</h2>
            <input
              type="number"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="Enter amount in ETH"
            />
            <button onClick={handleEthConfirmClick} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" }}>
              Confirm
            </button>
            <button onClick={() => setShowEthModal(false)} style={{ padding: "5px 10px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "5px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;