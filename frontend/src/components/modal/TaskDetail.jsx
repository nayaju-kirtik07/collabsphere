import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Typography, Divider, Tag, Avatar, Card, Descriptions, message, Button, Input } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  ProjectOutlined,
  ClockCircleOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text } = Typography;

const TaskDetail = ({ visible, onClose, task }) => {
  const [memberDetails, setMemberDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isProjectAdmin, setIsProjectAdmin] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const user_id = JSON.parse(localStorage.getItem("user"));

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (task?.member_id) {
        try {
          const memberResponse = await api.get(`/user/${task.member_id}`);
          setMemberDetails(memberResponse.data);
        } catch (error) {
          console.error('Error fetching member details:', error);
          message.error('Failed to load member details');
        }
      }

      if (task?.project_id) {
        try {
          const projectResponse = await api.get(`/getsingleproject/${task.project_id}`);
          setProjectDetails(projectResponse.data);
          
          // Check if the current user is the project admin
          const isAdmin = projectResponse.data.admin === true && 
                         projectResponse.data.member_id.some(
                           member => member._id === user_id || member === user_id
                         );
          setIsProjectAdmin(isAdmin);
        } catch (error) {
          console.error('Error fetching project details:', error);
          message.error('Failed to load project details');
        }
      }
    };

    if (visible && task) {
      fetchDetails();
      setEditedTask(task);
    }
  }, [visible, task, user_id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'default';
      case 'Pending':
        return 'orange';
      case 'Done':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatDate = (date) => {
    return moment(date).format('MMMM DD, YYYY');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedTask(task);
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/updatetask/${task._id}`, editedTask);
      if (response?.data) {
        message.success('Task updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      message.error('Failed to update task');
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Title level={4} style={{ margin: 0 }}>
            Task Details
          </Title>
          {isProjectAdmin && !isEditing && (
            <EditOutlined onClick={handleEditToggle} style={{ cursor: 'pointer' }} />
          )}
        </div>
      }
    >
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item 
            label={<Text strong>Task Name</Text>}
            labelStyle={{ width: '150px' }}
          >
            {isEditing ? (
              <Input 
                value={editedTask.name} 
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
              />
            ) : (
              <Text>{task?.name}</Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Text strong>Status</Text>}
          >
            <Tag color={getStatusColor(task?.status)}>
              {task?.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Text strong>Description</Text>}
          >
            {isEditing ? (
              <Input.TextArea 
                value={editedTask.description} 
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              />
            ) : (
              <Text>{task?.description || 'No description provided'}</Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Text strong>Assigned To</Text>}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar 
                icon={<UserOutlined />} 
                src={memberDetails?.profileImage}
              />
              <Text>{memberDetails?.username || 'Loading...'}</Text>
            </div>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Text strong>Project</Text>}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ProjectOutlined />
              <Text>{projectDetails?.name || 'Loading...'}</Text>
            </div>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Text strong>Created At</Text>}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarOutlined />
              <Text>{formatDate(task?.createdAt)}</Text>
            </div>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Text strong>Last Updated</Text>}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClockCircleOutlined />
              <Text>{formatDate(task?.updatedAt)}</Text>
            </div>
          </Descriptions.Item>
        </Descriptions>
        {isEditing && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={handleSave} type="primary" icon={<SaveOutlined />}>
              Save
            </Button>
          </div>
        )}
      </Card>
    </Modal>
  );
};

export default TaskDetail;