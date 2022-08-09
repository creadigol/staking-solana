import { Layout, Row, Col } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Minter from "../containers/Minter";
import Stake from "../containers/Stake";
import WrongNetwork from "../containers/WrongNetwork";
import logo from "../images/sol.png";
import { Route, Routes } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const AppLayout = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  return (
    <Row>
      <Col span={24}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header>
            <Row align="stretch" gutter={20}>
              <Col>
                <img src={logo} width={40} height={40} />
              </Col>
              <Col>
                <h1>
                  <font color="white">Solana NFT Stake</font>
                </h1>
              </Col>
              <Col flex="auto"></Col>
              <Col style={{ marginRight: 10 }}>
                <WalletMultiButton className="wallet-button" />
              </Col>
            </Row>
          </Header>
          <Content>
            {connected && publicKey != null && (
              <Routes>
                <Route path="/" element={<Minter />} />
                <Route path="/stake" element={<Stake />} />
              </Routes>
            )}
            {connected == false && <WrongNetwork />}
            {connected && publicKey == null && <WrongNetwork />}
          </Content>
         
        </Layout>
      </Col>
    </Row>
  );
};

export default AppLayout;
