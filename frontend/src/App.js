import React, { useEffect, useState, useRef } from "react";
import { Anchor, Col, Row, Typography, Card } from "antd";
import Detection from "./Detection";

const { Title, Paragraph } = Typography;

const App = () => {
  const topRef = useRef(null);
  const [targetOffset, setTargetOffset] = useState();

  useEffect(() => {
    setTargetOffset(topRef.current?.clientHeight);
  }, []);

  return (
    <div>
      <Row>
        <Col span={18}>
          {/* Page 1: Introduction */}
          <div
            id="part-1"
            style={{
              height: "100vh",
              background: "rgba(255,0,0,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "20px",
            }}
          >
            <Title level={2}>🔍 Credit Card Fraud Detection</Title>
            <Paragraph style={{ maxWidth: "70%", textAlign: "center" }}>
              Every year, billions of dollars are lost due to fraudulent transactions. Our
              AI-powered fraud detection system helps financial institutions identify and
              prevent unauthorized transactions in real-time.
            </Paragraph>
            <Card
              title="Why is Credit Card Fraud Detection Important?"
              bordered={false}
              style={{ width: "60%", textAlign: "left", marginTop: "20px" }}
            >
              <ul>
                <li>⚠️ Prevents financial losses for banks and customers</li>
                <li>🔐 Enhances security and trust in digital transactions</li>
                <li>📊 Uses AI to analyze transaction patterns and detect fraud</li>
              </ul>
            </Card>
          </div>

          {/* Page 2: Detection System */}
          <div
            id="part-2"
            style={{
              height: "100vh",
              background: "rgba(0,255,0,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Detection />
          </div>

          {/* Page 3: About Us */}
          <div
            id="part-3"
            style={{
              height: "100vh",
              background: "rgba(0,0,255,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "20px",
            }}
          >
            <Title level={2}>👥 About Us</Title>
            <Paragraph style={{ maxWidth: "70%", textAlign: "center" }}>
              We are a team of AI and cybersecurity enthusiasts dedicated to making
              financial transactions safer. Our fraud detection system is designed to
              analyze millions of transactions and detect fraudulent patterns using
              machine learning.
            </Paragraph>
            <Card
              title="Our Mission"
              bordered={false}
              style={{ width: "60%", textAlign: "left", marginTop: "20px" }}
            >
              <ul>
                <li>🛡️ Provide real-time fraud detection to financial institutions</li>
                <li>📈 Improve accuracy and reduce false positives</li>
                <li>🔬 Leverage AI & machine learning to stay ahead of fraudsters</li>
              </ul>
            </Card>
          </div>
        </Col>

        {/* Navigation Sidebar */}
        <Col span={6}>
          <Anchor
            targetOffset={targetOffset}
            items={[
              { key: "Introduction", href: "#part-1", title: "Introduction" },
              {
                key: "Detection System",
                href: "#part-2",
                title: "Detection System",
              },
              { key: "About us", href: "#part-3", title: "About us" },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default App;
