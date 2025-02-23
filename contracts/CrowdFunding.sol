// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        string image; // Added image field
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    // Function to create a new campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    // Function to donate to a campaign
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Get donators for a campaign
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // Get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    // TEST: Send ETH to an address
    function send(address to) external payable {
        (bool success, ) = to.call{value: msg.value}("");
        if (!success) {
            revert("Failed to send ETH");
        }
    }

    /// @notice Get the current balance of the contract
    /// @return The current balance
    function getBalance() public view returns (uint256) {
        return balance;
    }

    /// @notice Get the total amount deposited
    /// @return The total amount deposited
    function getTotalDeposited() public view returns (uint256) {
        return totalDeposited;
    }

    /// @notice Get the total amount withdrawn
    /// @return The total amount withdrawn
    function getTotalWithdrawn() public view returns (uint256) {
        return totalWithdrawn;
    }

    /// @notice Deposit funds into the contract
    /// @param _amount The amount to deposit
    function deposit(uint256 _amount) public payable {
        uint256 previousBalance = balance;
        
        // Only the owner can deposit
        require(msg.sender == owner, "You are not the owner of this account");
        
        // Ensure the deposit amount is greater than 0
        require(_amount > 0, "Deposit amount must be greater than zero");

        balance += _amount;
        totalDeposited += _amount;

        // Ensure the balance updated correctly
        require(balance == previousBalance + _amount, "Balance update failed");

        emit Deposit(_amount);
    }

    /// @notice Withdraw funds from the contract
    /// @param _withdrawAmount The amount to withdraw
    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        
        uint256 previousBalance = balance;
        
        // Ensure the withdrawal amount is valid
        require(_withdrawAmount > 0, "Withdrawal amount must be greater than zero");

        // Check for sufficient balance
        require(balance >= _withdrawAmount, "Insufficient balance");

        balance -= _withdrawAmount;
        totalWithdrawn += _withdrawAmount;

        // Ensure the balance updated correctly
        require(balance == previousBalance - _withdrawAmount, "Balance update failed");

        emit Withdraw(_withdrawAmount);
    }

    /// @notice Mint carbon credits (ERC20 tokens)
    /// @param to The address to mint the credits to
    /// @param amount The amount of credits to mint
    function mintCarbonCredits(address to, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can mint carbon credits");
        
        // Increase the user's carbon credits
        carbonCredits[to] += amount;
        
        // Increase the contract's balance by minted credits
        balance += amount;

        // Emit the event for minting carbon credits
        emit CarbonCreditsMinted(to, amount);
    }

    /// @notice Transfer carbon credits
    /// @param to The address to transfer the credits to
    /// @param amount The amount of credits to transfer
    function transferCarbonCredits(address to, uint256 amount) external {
        require(carbonCredits[msg.sender] >= amount, "Insufficient carbon credits");
        
        // Transfer the carbon credits
        carbonCredits[msg.sender] -= amount;
        carbonCredits[to] += amount;
        
        emit CarbonCreditsTransferred(msg.sender, to, amount);
    }

    /// @notice Burn carbon credits (retire them)
    /// @param amount The amount of credits to burn
    function burnCarbonCredits(uint256 amount) external {
        require(carbonCredits[msg.sender] >= amount, "Insufficient carbon credits");
        
        // Decrease the user's carbon credits and contract balance
        carbonCredits[msg.sender] -= amount;
        
        // Ensure balance cannot go negative
        require(balance >= amount, "Contract balance insufficient to burn credits");

        balance -= amount; // Decrease contract balance when credits are burned
        
        emit CarbonCreditsBurned(msg.sender, amount);
    }

    /// @notice Get the carbon credits of a specific user
    /// @param account The address of the user
    /// @return The amount of carbon credits owned by the user
    function getCarbonCredits(address account) external view returns (uint256) {
        return carbonCredits[account];
    }

    /// @notice Submit a request for carbon token approval
    /// @param _pinataHash The hash of the PDF stored on IPFS/Pinata
    function submitRequest(string memory _pinataHash) external {
        require(bytes(_pinataHash).length > 0, "Pinata hash cannot be empty.");

        // Create a new request
        requests.push(Request({
            requester: msg.sender,
            pinataHash: _pinataHash,
            approved: false,
            reviewed: false
        }));

        // Emit the event for request submission
        uint256 requestId = requests.length - 1;
        emit RequestSubmitted(msg.sender, requestId, _pinataHash);
    }

    /// @notice View a request's details by ID
    /// @param _requestId The ID of the request
    /// @return The details of the request
    function viewRequest(uint256 _requestId) external view returns (address, string memory, bool, bool) {
        require(_requestId < requests.length, "Invalid request ID.");
        Request memory req = requests[_requestId];
        return (req.requester, req.pinataHash, req.approved, req.reviewed);
    }

    /// @notice Approve a request
    /// @param _requestId The ID of the request to approve
    function approveRequest(uint256 _requestId) external onlyAdmin {
        require(_requestId < requests.length, "Invalid request ID.");
        Request storage req = requests[_requestId];
        require(!req.reviewed, "Request already reviewed.");

        req.approved = true;
        req.reviewed = true;

        emit RequestApproved(_requestId, req.requester);
    }

    /// @notice Reject a request
    /// @param _requestId The ID of the request to reject
    function rejectRequest(uint256 _requestId) external onlyAdmin {
        require(_requestId < requests.length, "Invalid request ID.");
        Request storage req = requests[_requestId];
        require(!req.reviewed, "Request already reviewed.");

        req.approved = false;
        req.reviewed = true;

        emit RequestRejected(_requestId, req.requester);
    }

    /// @notice View all requests for a particular user
    /// @param _user The address of the user
    /// @return The requests made by the user
    function viewUserRequests(address _user) external view returns (Request[] memory) {
        uint256 requestCount = 0;

        // Count the number of requests made by the user
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].requester == _user) {
                requestCount++;
            }
        }

        // Create an array to hold the user's requests
        Request[] memory userRequests = new Request[](requestCount);
        uint256 index = 0;

        // Populate the array with the user's requests
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].requester == _user) {
                userRequests[index] = requests[i];
                index++;
            }
        }

        return userRequests;
    }

    /// @notice Get the total number of requests
    /// @return The total number of requests
    function getRequestCount() external view returns (uint256) {
        return requests.length;
    }

    /// @notice Transfer ownership to a new admin
    /// @param newAdmin The address of the new admin
    function transferOwnership(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin address cannot be zero.");
        admin = newAdmin;
    }
}