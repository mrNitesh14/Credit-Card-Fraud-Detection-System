import React from "react";
import { Button, Form, Input, Tag, notification } from "antd";
// import bg from "./assets/bg.jpg";

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

  const apiUrl = process.env.FLASK_ENDPOINT || "http://localhost:5000/predict"; // Ensure API URL is defined

  const openNotificationWithIcon = (type, confidence) => {
    api[type]({
      message: type === "warning" ? "Fraud Detected" : "Not Fraud",
      description:
        type === "warning"
          ? `Transaction is Fraud `
          : `Transaction is not Fraud `,
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
      // Convert all values to numbers where applicable before sending the request
      const dataToSend = {};
      Inputs.forEach((input) => {
        const value = values[input];
        if (value && !isNaN(value)) {
          dataToSend[input] = parseFloat(value);
        } else {
          dataToSend[input] = value; // For non-numeric fields
        }
      });

      console.log("Sending data:", dataToSend); // Debugging log

      // Send data to the Flask backend
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log("Backend response:", result); // Debugging log

      if (response.ok) {
        // Show notification based on the prediction
        const type = result.prediction === 1 ? "warning" : "success";
        openNotificationWithIcon(type, (result.probability * 100).toFixed(2)); // Show confidence as a percentage
      } else {
        notification.error({
          message: "Prediction Error",
          description: result.error || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Request failed:", error); // Debugging log
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
            <Input placeholder={input} type="number" />
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
