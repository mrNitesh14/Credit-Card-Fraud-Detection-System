import React from "react";
import { Button, Form, Input, Tag, notification, Select } from "antd";

const { Option } = Select;

const Detection = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const apiUrl = "http://localhost:5000/predict";

  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: type === "warning" ? "Fraud Detected" : "Not Fraud",
      description: message,
    });
  };

  const Inputs = [
    { name: "TransactionAmount", label: "Transaction Amount", type: "number" },
    { name: "MerchantCategory", label: "Merchant Category", type: "select", options: ["Retail", "Electronics", "Food", "Travel", "Entertainment"] },
    { name: "TransactionType", label: "Transaction Type", type: "select", options: ["Purchase", "Withdrawal", "Transfer"] },
    { name: "CardType", label: "Card Type", type: "select", options: ["Debit", "Credit", "Prepaid"] },
    { name: "EntryMode", label: "Entry Mode", type: "select", options: ["Chip", "Magstripe", "Contactless", "Online"] },
    { name: "TransactionLocation", label: "Transaction Location", type: "text" },
    { name: "IP_Address", label: "IP Address", type: "text" },
    { name: "DeviceType", label: "Device Type", type: "select", options: ["Mobile", "Desktop", "Tablet", "POS"] },
    { name: "CardPresent", label: "Card Present", type: "select", options: [0, 1] },
    { name: "PreviousFraudTransactions", label: "Previous Fraud Transactions", type: "number" },
    { name: "AccountAge", label: "Account Age (days)", type: "number" },
    { name: "DailyTransactionCount", label: "Daily Transaction Count", type: "number" },
    { name: "DailyTransactionAmount", label: "Daily Transaction Amount", type: "number" },
    { name: "IsInternational", label: "Is International", type: "select", options: [0, 1] },
    { name: "TimeSinceLastTransaction", label: "Time Since Last Transaction (seconds)", type: "number" },
  ];

  const onFinish = async (values) => {
    try {
      console.log("Final data for API:", values);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Server Error");
      }

      const type = result.fraudulent ? "warning" : "success";
      openNotificationWithIcon(type, result.fraudulent ? "🚨 Fraudulent Transaction Detected!" : "✅ Transaction is Safe.");
    } catch (error) {
      console.error("Request failed:", error);
      notification.error({
        message: "Request Failed",
        description: error.message || "Could not reach the server.",
      });
    }
  };

  return (
    <div style={{ height: "100vh", width: "50vw", padding: "20px", overflow: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Form form={form} layout="vertical" requiredMark="optional" onFinish={onFinish} style={{ height: "80%", overflow: "auto" }}>
        {Inputs.map((input) => (
          <Form.Item key={input.name} label={<><Tag color="error">Required</Tag> {input.label}</>} name={input.name} rules={[{ required: true, message: `Please enter ${input.label}` }]}>
            {input.type === "select" ? (
              <Select placeholder={input.label}>
                {input.options.map((option) => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            ) : (
              <Input placeholder={input.label} type={input.type} />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  );
};

export default Detection;
