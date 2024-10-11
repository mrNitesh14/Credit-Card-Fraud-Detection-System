import React, { useEffect, useState, useRef } from "react";
import { Anchor, Col, Row } from "antd";
import Detection from "./Detection";

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
          <div
            id="part-1"
            style={{
              height: "100vh",
              background: "rgba(255,0,0,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Part 1
          </div>
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
          <div
            id="part-3"
            style={{
              height: "100vh",
              background: "rgba(0,0,255,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            >
            Part 2
          </div>
        </Col>
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
