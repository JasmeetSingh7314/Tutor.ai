// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title TutorAI
 * @dev ERC20 token for the Language AI Tutor platform on Sonic Chain
 */
contract TutorAI is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;
    
    constructor() ERC20("TutorAI", "TAI") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

/**
 * @title TutorAINFT
 * @dev ERC721 NFT for the Language AI Tutor platform
 */
contract TutorAINFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIds;
    mapping(address => uint256) public userToTokenId;
    
    struct UserData {
        string name;
        uint256 level;
        string title;
    }
    
    mapping(uint256 => UserData) public tokenData;
    
    constructor() ERC721("TutorAI Achievement", "TAINFT") Ownable(msg.sender) {}
    
    /**
     * @dev Check if user has an NFT
     */
    function hasNFT(address user) public view returns (bool) {
        return userToTokenId[user] != 0;
    }
    
    /**
     * @dev Mint a new NFT with user data
     */
    function mintNFT(address user, string memory name, uint256 level, string memory title) public onlyOwner returns (uint256) {
        require(userToTokenId[user] == 0, "User already has an NFT");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(user, newTokenId);
        userToTokenId[user] = newTokenId;
        
        // Store user data
        tokenData[newTokenId] = UserData(name, level, title);
        
        // Set token URI
        _setTokenURI(newTokenId, _generateTokenURI(newTokenId));
        
        return newTokenId;
    }
    
    /**
     * @dev Update existing NFT metadata
     */
    function updateNFT(address user, string memory name, uint256 level, string memory title) public onlyOwner {
        uint256 tokenId = userToTokenId[user];
        require(tokenId != 0, "User has no NFT");
        
        // Update user data
        tokenData[tokenId] = UserData(name, level, title);
        
        // Update token URI
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
    }
    
    /**
     * @dev Generate token URI with metadata
     */
    function _generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        UserData memory data = tokenData[tokenId];
        
        bytes memory metadata = abi.encodePacked(
            '{',
            '"name": "TutorAI Achievement #', tokenId.toString(), '",',
            '"description": "Achievement NFT for TutorAI Language Tutor platform",',
            '"attributes": [',
            '{"trait_type": "User Name", "value": "', data.name, '"},',
            '{"trait_type": "Level", "value": ', data.level.toString(), '},',
            '{"trait_type": "Title", "value": "', data.title, '"}',
            ']',
            '}'
        );
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(metadata)
            )
        );
    }
}

/**
 * @title TutorAITutor
 * @dev Simplified main contract for the Language AI Tutor platform
 */
contract TutorAITutor is Ownable {
    TutorAI public tutorToken;
    TutorAINFT public nftContract;
    
    // Reward structure for specific levels
    mapping(uint256 => uint256) public levelRewards;
    
    // Track claimed rewards
    mapping(address => mapping(uint256 => bool)) public hasClaimedReward;
    
    // Events
    event NFTMinted(address indexed user, uint256 tokenId, uint256 level);
    event NFTUpdated(address indexed user, uint256 tokenId, uint256 level);
    event RewardClaimed(address indexed user, uint256 level, uint256 amount);
    
    constructor(address _tokenAddress, address _nftAddress) Ownable(msg.sender) {
        tutorToken = TutorAI(_tokenAddress);
        nftContract = TutorAINFT(_nftAddress);
        
        // Set up reward tiers (token amounts for each milestone level)
        levelRewards[1] = 100 * 10**18;    // 100 tokens for level 1
        levelRewards[5] = 500 * 10**18;    // 500 tokens for level 5
        levelRewards[10] = 1000 * 10**18;  // 1,000 tokens for level 10
        levelRewards[50] = 5000 * 10**18;  // 5,000 tokens for level 50
        levelRewards[100] = 10000 * 10**18; // 10,000 tokens for level 100
    }
    
    /**
     * @dev Process user achievement - mint or update NFT and distribute rewards
     * All data is provided by the backend
     */
    function processUserAchievement(
        address user, 
        string memory name, 
        uint256 level, 
        string memory title
    ) public onlyOwner {
        // Check if user already has an NFT
        if (!nftContract.hasNFT(user)) {
            // Mint new NFT
            uint256 tokenId = nftContract.mintNFT(user, name, level, title);
            emit NFTMinted(user, tokenId, level);
        } else {
            // Update existing NFT
            nftContract.updateNFT(user, name, level, title);
            emit NFTUpdated(user, nftContract.userToTokenId(user), level);
        }
        
        // Check for level milestone rewards
        distributeRewardsIfEligible(user, level);
    }
    
    /**
     * @dev Distribute rewards for milestone levels if eligible
     */
    function distributeRewardsIfEligible(address user, uint256 level) internal {
        // Check all milestone levels up to the current level
        uint256[] memory milestones = new uint256[](5);
        milestones[0] = 1;
        milestones[1] = 5;
        milestones[2] = 10;
        milestones[3] = 50;
        milestones[4] = 100;
        
        for (uint i = 0; i < milestones.length; i++) {
            uint256 milestone = milestones[i];
            
            // If user has reached this milestone and hasn't claimed reward yet
            if (level >= milestone && !hasClaimedReward[user][milestone]) {
                hasClaimedReward[user][milestone] = true;
                
                // Transfer tokens to user
                uint256 rewardAmount = levelRewards[milestone];
                if (rewardAmount > 0) {
                    bool success = tutorToken.transferFrom(owner(), user, rewardAmount);
                    if (success) {
                        emit RewardClaimed(user, milestone, rewardAmount);
                    }
                }
            }
        }
    }
    
    /**
     * @dev Set reward amount for a specific level
     */
    function setLevelReward(uint256 level, uint256 amount) public onlyOwner {
        levelRewards[level] = amount;
    }
    
    /**
     * @dev Manually trigger reward distribution for a specific level
     */
    function manuallyDistributeReward(address user, uint256 level) public onlyOwner {
        require(levelRewards[level] > 0, "No reward set for this level");
        require(!hasClaimedReward[user][level], "Reward already claimed");
        
        hasClaimedReward[user][level] = true;
        uint256 rewardAmount = levelRewards[level];
        
        bool success = tutorToken.transferFrom(owner(), user, rewardAmount);
        if (success) {
            emit RewardClaimed(user, level, rewardAmount);
        }
    }
}