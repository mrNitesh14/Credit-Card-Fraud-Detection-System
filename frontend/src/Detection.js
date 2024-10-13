import React from "react";
import { Button, Form, Input, Tag, notification } from "antd";
import bg from "./assets/bg.jpg";

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? (
      <Tag color="error">Required</Tag>
    ) : (
      <Tag color="warning">Optional</Tag>
    )}
    {label}
  </>
);

const Detection = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const apiUrl =
    "http://localhost:5000/predict" || process.env.FLASK_ENDPOINT; ;

  const openNotificationWithIcon = (type, confidance) => {
    api[type]({
      message: type === "warning" ? "Fraud Detected" : "Not Fraud",
      description:
        type === "warning"
          ? `Transaction is Fraud with ${confidance} confidence`
          : `Transaction is not Fraud with ${confidance} confidence`,
    });
  };

  const Inputs = [
    "Time",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
    "V18",
    "V19",
    "V20",
    "V21",
    "V22",
    "V23",
    "V24",
    "V25",
    "V26",
    "V27",
    "V28",
    "Amount",
  ];

  const onFinish = async (values) => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), 
      });

      const result = await response.json();

      if (response.ok) {
        const type = result.prediction === 1 ? "warning" : "success";
        openNotificationWithIcon(type, 90); 
      } else {
        notification.error({
          message: "Prediction Error",
          description: result.error || "An error occurred",
        });
      }
    } catch (error) {
      notification.error({
        message: "Request Failed",
        description: "Could not reach the server.",
      });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "50vw",
        padding: "20px",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={customizeRequiredMark}
        onFinish={onFinish} 
        style={{
          height: "80%",
          overflow: "auto",
        }}
      >
        {Inputs.map((input) => (
          <Form.Item
            key={input}
            label={input}
            name={input} // Ensure name matches keys expected by the backend
            required
            tooltip="This is a required field"
          >
            <Input placeholder={input} />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  );
};

export default Detection;
