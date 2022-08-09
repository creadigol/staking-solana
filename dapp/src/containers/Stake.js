import {
    Button,
    Card,
    Form,
    Row,
    Col,
   
  } from "antd";
  
  import { Connection, clusterApiUrl, Keypair, PublicKey, TransactionInstruction  } from "@solana/web3.js";
  import {TransactionEnvelope, SolanaProvider
  } from "@saberhq/solana-contrib";
  import { useConnection, useWallet } from "@solana/wallet-adapter-react";
  import { Program } from "@project-serum/anchor";
  import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress
  } from "@solana/spl-token";
  import * as anchor from "@project-serum/anchor";
  import  STAKE_POOL_TYPES from "../idl/stak_pool.json";
  import SolMintNftIdl from "../idl/sol_mint_nft.json";
  import  { BN } from "@project-serum/anchor";
  
  const { Meta } = Card;

  const Stake = () => {
    const { connection } = useConnection();
  const wallet = useWallet();
  
    const provider = new anchor.AnchorProvider(connection, wallet);
    anchor.setProvider(provider);
    let originalMintTokenAccountId = new PublicKey("5UKnByhixVsGtSLGtxu8bEk2b26WRK16KhL8AKpeEw6F");
  let originalMint  = new PublicKey("9V1zVuNnrJq5uiEx2JLJgzwcq1d6hQ9VAtazc3myx4ze");
  let stakePoolId = new PublicKey("FZYHxYFRmMNhbMfyfVNb7KFMEjjy95QRRnSgBDxx1ags");
     const STAKE_POOL_ADDRESS = new PublicKey("9DP16tQerNdCrb4E1AiwaK8kRviWDu2NaKtt1vR86sdc");
     const stakePoolProgram = new Program(
      STAKE_POOL_TYPES,
      STAKE_POOL_ADDRESS, 
      provider
    );
    const stake_Token = async () =>{
      const keypair = Keypair.generate();
      const nftTokenAccount = await getAssociatedTokenAddress(
        keypair.publicKey,
        provider.wallet.publicKey
      );
      /* @ts-ignore */
      
      // new TransactionEnvelope(SolanaProvider.init(provider), [
      //   ...(
      //     TransactionInstruction=>{
      //       return stakePoolProgram.instructions.stake(new BN(4000000000), {
      //         accounts: {
      //           stakePool: stakePoolId,
      //           stakeEntry : keypair.publicKey,
      //           stakeEntryOriginalMintTokenAccount:nftTokenAccount,
      //           originalMint: originalMint,
      //           user: provider.wallet.publicKey,
      //           userOriginalMintTokenAccount: originalMintTokenAccountId,
      //           tokenProgram: TOKEN_PROGRAM_ID
      //         },
      //     }
      //       )
      //   }
          
      //   )
      // ]);
      console.log("nftTokenAccount :", nftTokenAccount.toString());
     const mint_tx  = await stakePoolProgram.transaction.stake(new BN(4000000000), {
        accounts: {
          stakePool: stakePoolId,
          stakeEntry : keypair.publicKey,
          stakeEntryOriginalMintTokenAccount:nftTokenAccount,
          originalMint: originalMint,
          user: provider.wallet.publicKey,
          userOriginalMintTokenAccount: originalMintTokenAccountId,
          tokenProgram: STAKE_POOL_ADDRESS
        },
      });
      const signature = await wallet.sendTransaction(mint_tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      // const mint_tx = new anchor.web3.Transaction().add(
      //   stakePoolProgram.transaction.stake(new BN(4000000000), {
      //     accounts: {
      //       stakePool: stakePoolId,
      //       stakeEntry : keypair.publicKey,
      //       stakeEntryOriginalMintTokenAccount:nftTokenAccount,
      //       originalMint: originalMint,
      //       user: provider.wallet.publicKey,
      //       userOriginalMintTokenAccount: originalMintTokenAccountId,
      //       tokenProgram: TOKEN_PROGRAM_ID
      //     },
      //   })
      // );
      // let blockhashObj = await connection.getLatestBlockhash();
      // console.log("blockhashObj", blockhashObj);
      // mint_tx.recentBlockhash = blockhashObj.blockhash;
  
    
    }
    return (
      <Row style={{ margin: 60 }}>
        
        <Col span={16} offset={4} style={{ marginTop: 10 }}>
          <Card title="Create Stake Pool">
           
              <Button type="primary" onClick={stake_Token} htmlType="button" style={{ width: 200 }}>
                 Create Pool
                </Button>
             
            
          </Card>
        </Col>
        
       
      </Row>
      
    );
  };
  
  export default Stake;
  