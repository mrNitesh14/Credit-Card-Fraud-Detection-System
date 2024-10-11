import React from "react";
import { Button, Form, Input, Tag } from "antd";
import { notification, Space } from "antd";

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
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, confidance) => {
    // 'warning' , 'success'
    api[type]({
      message: type === "warning" ? "Fraud Detected" : "Not a Detected",
      description:
        type === "warning"
          ? "Transcation is Fraud with " + confidance + " confidance"
          : "Transcation is not Fraud with " + confidance + " confidance",
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
  const [form] = Form.useForm();
  const apiUrl =
    `${process.env.FLASK_ENDPOING}/detection` ||
    "http://localhost:5000/detection";

  return (
    <Form
      style={{
        height: "100vh",
        width: "50vw",
        background: "rgba(0,255,0,0.05)",
        overflow: "auto",
        padding: "20px",
      }}
      action={apiUrl}
      method="post"
      form={form}
      layout="vertical"
      requiredMark={customizeRequiredMark}
    >
      {Inputs.map((input) => (
        <>
          <Form.Item label={input} required tooltip="This is a required field">
            <Input placeholder={input} />
          </Form.Item>
        </>
      ))}
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default Detection;
