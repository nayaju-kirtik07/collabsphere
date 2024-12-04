import React, { useState } from 'react';
import { Button, Select, Modal, Form, Input, DatePicker, Row, Col, message } from 'antd';
import axios from "axios";

const CreateNewProject = ({ users, reload, setReload }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const projectData = {
        ...values,
        member_id: values.members, 
        admin: true
      }
      api
        .post(`/addproject`, projectData)
        .then(() => {
          message.success("Project created successfully!");
          setReload(!reload);
          setOpen(false);
          form.resetFields();
        })
        .catch((error) => {
          message.error(error?.response?.data?.message || "Failed to create project. Please try again.");
        });
    }).catch((info) => {
      message.error('Please fill in all required fields');
    });
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Project
      </Button>
      <Modal
        title="Add Project"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label="Name" 
                rules={[{ required: true, message: 'Please enter the project name' }]}
              >
                <Input placeholder="Enter Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="dueDate" 
                label="Due Date" 
                rules={[{ required: true, message: 'Please select the due date' }]}
              >
                <DatePicker style={{ width: '100%' }} format="MM/DD/YYYY" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="members" 
                label="Members" 
                rules={[{ required: true, message: 'Please select at least one member' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Members"
                  style={{ width: '100%' }}
                >
                  {users.map(user => (
                    <Select.Option key={user?._id} value={user?._id}>
                      {user?.username}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} placeholder="Enter Project Details" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateNewProject;