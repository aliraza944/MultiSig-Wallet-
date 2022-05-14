// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./SafeMath.sol";

contract MultiSigWallet {
    using SafeMath for uint256;
    address public owner;
    mapping(address => bool) public isBOD;
    struct Charity {
        uint256 charityID;
        address donationRecipient;
        string charityName;
        uint256 targetDonationAmount;
        uint256 currentDonationAmount;
        address[] donors;
    }
    mapping(uint256 => Charity) public charities;
    mapping(uint256 => bool) public isAlreadyACharity;

    constructor() {
        owner = msg.sender;
    }

    // modifiers

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    function addBOD(address _bod) external onlyOwner {
        require(msg.sender != address(0));
        isBOD[_bod] = true;
    }

    function removeBOD(address _bod) external onlyOwner {
        require(msg.sender != address(0));
        isBOD[_bod] = false;
    }

    function addCharity(
        uint256 _id,
        address _recipient,
        string memory _name,
        uint256 _targetDonation
    ) external onlyOwner {
        require(isAlreadyACharity[_id] != true, "already present");
        require(_recipient != address(0));
        //updating a Charity
        isAlreadyACharity[_id] = true;
        charities[_id].charityID = _id;
        charities[_id].donationRecipient = _recipient;
        charities[_id].charityName = _name;
        charities[_id].targetDonationAmount = _targetDonation;
    }

    function donateToCharity(uint256 _id) external payable {
        require(isAlreadyACharity[_id] == true, "not a charity");
        require(
            charities[_id].currentDonationAmount !=
                charities[_id].targetDonationAmount,
            "donation target reached"
        );
        require(msg.value > 0, "must be some value");
        charities[_id].currentDonationAmount = charities[_id]
            .currentDonationAmount
            .add(msg.value);
        charities[_id].donors.push(msg.sender);
    }
}
