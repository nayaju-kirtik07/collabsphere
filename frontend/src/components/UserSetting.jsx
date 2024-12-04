import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Button, Upload, message, Avatar, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, UploadOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserSettings = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/getMyProfile');
        setUserDetails(response.data);
        setImageUrl(response.data.profileImage);
        form.setFieldsValue({
          username: response.data.username,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        message.error('Failed to load user details');
      }
    };

    if (visible) {
      fetchUserDetails();
    }
  }, [visible, form]);

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      const response = await api.put('/updateProfile', values);
      if (response.data) {
        message.success('Profile updated successfully');
        setUserDetails(response.data);
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }
      
      const response = await api.put('/updatePassword', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      if (response.data) {
        message.success('Password updated successfully');
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/uploadImage', formData);
      if (response.data) {
        setImageUrl(response.data.userData.profileImage);
        message.success('Profile image updated successfully');
      }
    } catch (error) {
      message.error('Failed to upload image');
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      title={
        <Title level={4} style={{ margin: 0 }}>
          Account Settings
        </Title>
      }
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%', alignItems: 'center' }}>
              <Avatar
                size={100}
                src={imageUrl}
                icon={<UserOutlined />}
                style={{ marginBottom: 8 }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImageUpload(file);
                  return false;
                }}
              >
                <Button icon={<CameraOutlined />}>Change Photo</Button>
              </Upload>
            </Space>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Security" key="2">
          <Card>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please input your current password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default UserSettings;
