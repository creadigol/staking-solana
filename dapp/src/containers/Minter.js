import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Alert,
  Result,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import { InboxOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";

import * as ipfsClient from "ipfs-http-client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import * as anchor from "@project-serum/anchor";
 import { Program } from "@project-serum/anchor";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";

import SolMintNftIdl from "../idl/sol_mint_nft.json";
import base58 from "base58";
const bs58 = require('bs58');
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const SOL_MINT_NFT_PROGRAM_ID = new anchor.web3.PublicKey(
  "9FKLho9AUYScrrKgJbG1mExt5nSgEfk1CNEbR8qBwKTZ"
);

const NFT_SYMBOL = "JERRY";

const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
const { Meta } = Card;
const Minter = () => {
  let navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [form] = useForm();
  const [imageFileBuffer, setImageFileBuffer] = useState(null);
  const [saleType, setSaleType] = useState("no_sale");
  const [Nftlist, setNftList] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const onFileSelected = (file) => {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setImageFileBuffer(Buffer(reader.result));
    };
    return false;
  };
 
  const getNftList = async (address) =>{
    try {
    
    
     const keypair = Keypair.generate();

     const metaplex = new Metaplex(connection);
     metaplex.use(keypairIdentity(keypair));
     const allNFTs = await metaplex.nfts().findAllByOwner(wallet.publicKey);
     setNftList(allNFTs);
     console.log("allNFTs : ", MINT_SIZE);
    } catch (error) {
      console.log("Error thrown, while fetching NFTs", error.message);
    }
  } 
  useEffect(()=>{
    getNftList(wallet.publicKey.toString());
  },[wallet]);
 
  const onCreate = async (values) => {
    console.log("Connection: ", connection);
    

    
    // let uploadedImageUrl = await uploadImageToIpfs();
    // if (uploadImageToIpfs == null) return;
    // console.log("Uploaded image url: ", uploadedImageUrl);

    let uploadedMetatdataUrl = await uploadMetadataToIpfs(
      "NFT Solana",
      "JERRY",
      "JERRY TEST DESCRIPTION",
      "https://gateway.pinata.cloud/ipfs/QmPjGam9Hi1iPe4CbSzh87q1iT626fZVbXzSGXaiWX3wLE/MoonWhipsDog3.png",
      "20",
      "LIVE",
      "BURGER"
    );
    if (uploadedMetatdataUrl == null) return;
    console.log("Uploaded meta data url: ", uploadedMetatdataUrl);

    setMinting(true);
    const result = await mint("MoonWhips Dog #3", NFT_SYMBOL, uploadedMetatdataUrl);
    setMinting(false);
    setMintSuccess(result);
  };

 

  const uploadMetadataToIpfs = async (
    name,
    symbol,
    description,
    uploadedImage,
    traitSize,
    traitLiveIn,
    traitFood
  ) => {
    const metadata = {
      name,
      symbol,
      description,
      image: uploadedImage,
      attributes: [
        {
          trait_type: "size",
          value: traitSize,
        },
        {
          trait_type: "live in",
          value: traitLiveIn,
        },
        {
          trait_type: "food",
          value: traitFood,
        },
      ],
    };

    setUploading(true);
    const uploadedMetadata = await ipfs.add(JSON.stringify(metadata));
    setUploading(false);

    if (uploadedMetadata == null) {
      return null;
    } else {
      return `https://ipfs.infura.io/ipfs/${uploadedMetadata.path}`;
    }
  };

  const mint = async (name, symbol, metadataUrl) => {
    const provider = new anchor.AnchorProvider(connection, wallet);
    anchor.setProvider(provider);

    const program = new Program(
      SolMintNftIdl,
      SOL_MINT_NFT_PROGRAM_ID,
      provider
    );
    console.log("Program Id: ", program.programId.toBase58());
    console.log("Mint Size: ", MINT_SIZE);
    const lamports =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );
    console.log("Mint Account Lamports: ", lamports);

    const getMetadata = async (mint) => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };

    const mintKey = anchor.web3.Keypair.generate();

    const nftTokenAccount = await getAssociatedTokenAddress(
      mintKey.publicKey,
      provider.wallet.publicKey
    );
    console.log("NFT Account: ", nftTokenAccount.toBase58());

    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: mintKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        mintKey.publicKey,
        0,
        provider.wallet.publicKey,
        provider.wallet.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        nftTokenAccount,
        provider.wallet.publicKey,
        mintKey.publicKey
      )
    );
    let blockhashObj = await connection.getLatestBlockhash();
    console.log("blockhashObj", blockhashObj);
    mint_tx.recentBlockhash = blockhashObj.blockhash;

    try {
      const signature = await wallet.sendTransaction(mint_tx, connection, {
        signers: [mintKey],
      });
      await connection.confirmTransaction(signature, "confirmed");
    } catch {
      return false;
    }

    console.log("Mint key: ", mintKey.publicKey.toString());
    console.log("User: ", provider.wallet.publicKey.toString());

    const metadataAddress = await getMetadata(mintKey.publicKey);
    console.log("Metadata address: ", metadataAddress.toBase58());

    try {
      const tx = program.transaction.mintNft(
        mintKey.publicKey,
        name,
        symbol,
        metadataUrl,
        {
          accounts: {
            mintAuthority: provider.wallet.publicKey,
            mint: mintKey.publicKey,
            tokenAccount: nftTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadata: metadataAddress,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            payer: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          },
        }
      );

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Mint Success!");
	  console.log("mintKey.publicKey :", mintKey.publicKey.toString());
	  console.log("nftTokenAccount!", nftTokenAccount.toString());
      return true;
    } catch {
      return false;
    }
  };

  const onMintAgain = () => {
    setMintSuccess(false);
    form.resetFields();
  };
  const burnNftHandler = ()=>{

  }
  if (mintSuccess) {
    return (
      <Result
        style={{ marginTop: 60 }}
        status="success"
        title="Successfully minted new NFT!"
        subTitle="You can check this new NFT in your wallet."
        extra={[
          <Button key="buy" onClick={onMintAgain}>
            Mint Again
          </Button>,
        ]}
      />
    );
  }
  const b = bs58.decode('4tPcujuQRvxc3X8jp5zM48X2ZzC3eKH8TSu7hquk4HsBHumz7uwU8W7RRF5ti4QJeDVUVD1mqCZTDxQrFHxLCTgN');
  const j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  
  return (
    <Row style={{ margin: 60 }}>
      {minting && (
        <Col span={16} offset={4}>
          <Alert message="Minting..." type="info" showIcon />
        </Col>
      )}
      {uploading && (
        <Col span={16} offset={4}>
          <Alert message="Uploading image..." type="info" showIcon />
        </Col>
      )}
      <Col span={16} offset={4} style={{ marginTop: 10 }}>
        <Card title="Create New NFT">
          <Form
            form={form}
            layout="vertical"
            labelCol={8}
            wrapperCol={16}
            onFinish={onCreate}
          >
            

            <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
              <Button type="primary" htmlType="submit" style={{ width: 200 }}>
                Mint Nft
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      
      <Row style={{ marginTop: 20 }}>
        {Nftlist.map((d, index)=>(
        <Col span={6} style={{padding:"20px"}} key={"nft_"+index} >
          <Card hoverable  >
          <Meta title={d.name} description={d.mint.toString()} />
          <Button type="primary" onClick={burnNftHandler} style={{ width: 200, marginTop:20 }}>
               Burn NFT
              </Button>
        </Card>
        </Col>
))}
      </Row>
    </Row>
    
  );
};

export default Minter;
