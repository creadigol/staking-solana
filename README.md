<h2>Create Pool function : initPool</h2>
<p>arg Define Variable : InitPoolIx</p>

============Argument Paramters===================

<p>overlayText => Stacking related Text Define Here (Optional)</p>
<p> imageUri => Set pool image Url (Optional)</p>
<p> requiresCollections  => set validation for specific collection nft stake (PublicKey) (Optional)</p>
<p> requiresCreators =>  List of required creators pubkeys (Optional)</p>
 <p>requiresAuthorization =>  Boolean to require authorization (Optional)</p>
 
<p> resetOnStake =>  Boolean to reset an entry's total stake seconds on unstake (Optional)</p>
<p> cooldownSeconds => Number of seconds for token to cool down before returned to the staker (Optional)</p>
<p> endDate => set for stake period limit in Number of seconds (Optional)</p>
 
 
 -------------------------------------------------------------
 
 <h2>Reward Set function : initRewardDistributor </h2>
 
 ============Argument Paramters===================
<p> stakePoolId => gererated by : initPool, for set reward for specific pool</p>
<p> rewardMintId => set PublicKey key for reward token</p>
<p> rewardAmount => Set Reward Amount </p>
<p> rewardDurationSeconds => Set reward Duration in seconds (Optional) </p>
<p> rewardDistributorKind => Reward distributor kind Mint or Treasury (Optional) </p>
 <p>maxSupply =>  Max supply (Optional) </p>
 <p>supply -  Supply (Optional)</p>
 
 <h2>Create Stake Function : stake</h2>
 
  ============Argument Paramters===================
 <p> stakePoolId => gererated by : initPool, for set stake settings </p>
 <p>originalMintId => nft Mint id PublicKey</p>
 <p>userOriginalMintTokenAccountId => nft mint token account id PublicKey </p>

<h2>Create Unstake Function : unstake</h2>
 
  ============Argument Paramters===================
<p>stakePoolId => gererated by : initPool, for set stake settings </p>
<p> originalMintId => nft Mint id PublicKey</p>
 
<h2>Get claim Rewards : claimRewards </h2>
 
  ============Argument Paramters===================
<p>stakePoolId => gererated by : initPool, for set stake settings </p>
<p>stakeEntryId => nft Mint id PublicKey </p>
  
<h2>Get claim Fund : reclaimFunds </h2>
 
  ============Argument Paramters===================
<p>stakePoolId => gererated by : initPool, for set stake settings </p>
<p>amount </p>
    

 
<h3>How To Test Function?</h3> 
<p>Link : <a href="https://watch.screencastify.com/v/6soM1hsm2sw3UrdmYFSq" target="_blank">https://watch.screencastify.com/v/6soM1hsm2sw3UrdmYFSq</a></p>
 
