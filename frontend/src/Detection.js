import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tag } from "antd";

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

/*
['Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
              'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19',
              'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 
              'Amount']
*/

const Detection = () => {
  const [form] = Form.useForm();
  const apiUrl = `${process.env.FLASK_ENDPOING}/detection` || "http://localhost:5000/detection";

  return (
    <Form action={apiUrl} method="post"
      form={form}
      layout="vertical"
      requiredMark={customizeRequiredMark}
    >
      <Form.Item label="Field A" required tooltip="This is a required field" >
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item
        label="Field B"
        tooltip={{
          title: "Tooltip with customize icon",
          icon: <InfoCircleOutlined />,
        }}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default Detection;
