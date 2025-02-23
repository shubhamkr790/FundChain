import React, { useState } from "react";
import Wenb3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORT
import {
  CrowdFundingABI,
  CrowdFundingAddress,
  handleNetworkSwitch,
} from "./contants";

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline, image } = campaign;

    // Validate amount
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      console.error("Amount must be a valid number");
      return;
    }

    const web3Modal = new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createCampaign(
        currentAccount, // owner
        title, // title
        description, // description
        ethers.utils.parseUnits(amount, "ether"), // Convert amount to wei
        new Date(deadline).getTime(), // Convert deadline to Unix timestamp
        image // Pass image to the smart contract
      );

      await transaction.wait();

      console.log("Contract call success", transaction);
      window.location.reload();
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    try {
      const address = await checkIfWalletConnected();
      if (address) {
        const web3Modal = new Wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign, i) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: campaign.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(
            campaign.amountCollected.toString()
          ),
          image: campaign.image, // Include image in the parsed data
          pId: i,
        }));
        console.log(parsedCampaigns);
        return parsedCampaigns;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCampaigns = async () => {
    try {
      const address = await checkIfWalletConnected();
      if (address) {
        const web3Modal = new Wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = fetchContract(provider);

        const allCampaigns = await contract.getCampaigns();

        const filteredCampaigns = allCampaigns.filter(
          (campaign) => campaign.owner.toLowerCase() === address.toLowerCase()
        );

        const userData = filteredCampaigns.map((campaign, i) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: campaign.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(
            campaign.amountCollected.toString()
          ),
          image: campaign.image, // Include image in the parsed data
          pId: i,
        }));

        return userData;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const donate = async (pId, amount) => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const campaignData = await contract.donateToCampaign(pId, {
        value: ethers.utils.parseEther(amount),
      });

      await campaignData.wait();
      window.location.reload();

      return campaignData;
    } catch (error) {
      console.log(error);
    }
  };

  const getDonations = async (pId) => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const contract = fetchContract(provider);

      const donations = await contract.getDonators(pId);
      const numberOfDonations = donations[0].length;

      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString()),
        });
      }

      return parsedDonations;
    } catch (error) {
      console.log(error);
    }
  };

  // CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");
      const network = await handleNetworkSwitch();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        return accounts[0];
      } else {
        console.log("No Account Found");
      }
    } catch (error) {
      console.log("Something wrong while connecting to wallet");
    }
  };

  // CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error while connecting to wallet");
    }
  };

  const gasLimit = async () => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
      const donations = await contract.send(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        {
          value: ethers.utils.parseEther("45"),
          gasLimit: 100000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
        gasLimit,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};