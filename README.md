<h2>Create Pool function : initPool</h2>
arg Define Variable : InitPoolIx

============Argument Paramters===================

overlayText => Stacking related Text Define Here (Optional)
imageUri => Set pool image Url (Optional)
 requiresCollections  => set validation for specific collection nft stake (PublicKey) (Optional)
 requiresCreators =>  List of required creators pubkeys (Optional)
 requiresAuthorization =>  Boolean to require authorization (Optional)
 
 resetOnStake =>  Boolean to reset an entry's total stake seconds on unstake (Optional)
 cooldownSeconds => Number of seconds for token to cool down before returned to the staker (Optional)
 endDate => set for stake period limit in Number of seconds (Optional)
 
 
 -------------------------------------------------------------
 
 Reward Set function : initRewardDistributor 
 
 ============Argument Paramters===================
 stakePoolId => gererated by : initPool, for set reward for specific pool
 rewardMintId => set PublicKey key for reward token
 rewardAmount => Set Reward Amount
 rewardDurationSeconds => Set reward Duration in seconds (Optional)
 rewardDistributorKind => Reward distributor kind Mint or Treasury (Optional)
 maxSupply =>  Max supply (Optional)
 supply -  Supply (Optional)
 
 Create Stake Function : stake
 
  ============Argument Paramters===================
 stakePoolId => gererated by : initPool, for set stake settings
originalMintId => nft Mint id PublicKey
userOriginalMintTokenAccountId => nft mint token account id PublicKey 

Create Unstake Function : unstake
 
  ============Argument Paramters===================
stakePoolId => gererated by : initPool, for set stake settings
originalMintId => nft Mint id PublicKey
 
Get claim Rewards : claimRewards
 
  ============Argument Paramters===================
stakePoolId => gererated by : initPool, for set stake settings
stakeEntryId => nft Mint id PublicKey
  
Get claim Fund : reclaimFunds
 
  ============Argument Paramters===================
stakePoolId => gererated by : initPool, for set stake settings
amount => 
    

 
 
 
