import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Row,
  Col,
  Card,
  Typography,
  Descriptions,
  Tag,
  Progress,
  Input,
  DatePicker,
  Button,
  Avatar,
  Space,
  Popconfirm,
  Select,
  message,
  List,
  Tooltip as AntTooltip,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

ChartJS.register(ArcElement, Tooltip, Legend);

const formatDate = (date) => {
  if (!date) return "";
  return moment(date).format("YYYY-MM-DD");
};

const calculateDaysRemaining = (dueDate) => {
  if (!dueDate) return 0;
  const today = moment();
  const due = moment(dueDate);
  return due.diff(today, "days");
};

const ProjectDetail = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { projectId } = useParams();

  const [projectDetail, setProjectDetail] = useState({});
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reload, setReload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  const getProjectByProjectId = () => {
    api
      .get(`/getsingleproject/${projectId}`)
      .then((res) => {
        console.log(res?.data);
        setProjectDetail(res?.data);
        setEditedDescription(res?.data.description);
        setEditedDueDate(moment(res?.data.dueDate));
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  const isCurrentUserAdmin = projectDetail.admin;

  const getAvailableUsers = async () => {
    try {
      const response = await api.get("/getallusers");
      setAvailableUsers(response.data);
    } catch (error) {
      console.error(error?.message);
    }
  };

  useEffect(() => {
    if (projectId) {
      getProjectByProjectId();
      getAvailableUsers();
    }
  }, [projectId, reload]);

  const todoCount =
    projectDetail?.task_id?.filter((task) => task.status === "To Do").length ||
    0;
  const pendingCount =
    projectDetail?.task_id?.filter((task) => task.status === "Pending")
      .length || 0;
  const doneCount =
    projectDetail?.task_id?.filter((task) => task.status === "Done").length ||
    0;

  const data = {
    labels: ["To Do", "Pending", "Done"],
    datasets: [
      {
        data: [todoCount, pendingCount, doneCount],
        backgroundColor: ["#808080", "#faad14", "#73d13d"],
        hoverOffset: 4,
      },
    ],
  };

  const calculateProjectStatus = () => {
    if (!projectDetail?.task_id || projectDetail.task_id.length === 0) {
      return "Pending"; 
    }

    const allCompleted = projectDetail.task_id.every(task => task.status === "Done");
    return allCompleted ? "Completed" : "Pending";
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "green" : "orange";
  };

  const totalTasks = todoCount + pendingCount + doneCount;
  const completionPercentage = Math.round((doneCount / totalTasks) * 100) || 0;

  const handleSaveDescription = async () => {
    if (!isCurrentUserAdmin) {
      message.error("Only admins can edit the description");
      return;
    }

    try {
      const response = await api.put(`/updateproject/${projectId}`, {
        description: editedDescription,
      });

      if (response?.data) {
        setProjectDetail(response.data);
        setIsEditingDescription(false);
        message.success("Description updated successfully");
      }
    } catch (error) {
      console.error(error.message);
      message.error("Failed to update project description");
    }
  };

  const handleSaveDueDate = async () => {
    if (!isCurrentUserAdmin) {
      message.error("Only admins can edit the due date");
      return;
    }
    try {
      const formattedDate = editedDueDate
        ? editedDueDate.format("YYYY-MM-DD")
        : null;
      const response = await api.put(`/updateproject/${projectId}`, {
        dueDate: formattedDate,
      });

      if (response?.data) {
        setProjectDetail(response.data);
        setIsEditingDueDate(false);
        message.success("Due date updated successfully");
      }
    } catch (error) {
      console.error(error.message);
      message.error("Failed to update due date");
    }
  };

  const handleRemoveTeamMember = async (memberIdToRemove) => {
    if (!isCurrentUserAdmin) {
      message.error("Only admins can remove team members");
      return;
    }
    
    try {
      const response = await api.put(`/removemember/${projectId}`, {
        member_id: memberIdToRemove,
      });

      if (response?.data) {
        setProjectDetail(response.data);
        message.success("Member removed successfully");
      }
    } catch (error) {
      console.error(error.message);
      message.error("Failed to remove member");
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value) {
      try {
        const response = await api.get(`/searchuser/${value}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error(error.message);
        message.error("Failed to search users");
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddTeamMember = async () => {
    if (!isCurrentUserAdmin) {
      message.error("Only admins can add team members");
      return;
    }
    if (!selectedUser) {
      message.error("Please select a user to add");
      return;
    }
    try {
      const response = await api.post(`/addmember/${projectId}`, { userId: selectedUser });
      setProjectDetail(response?.data);
      setReload(!reload);
      setSelectedUser(null);
      message.success("Member added successfully");
    } catch (error) {
      console.error(error?.message);
      message.error("Failed to add member");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUser((prevSelectedUser) => (prevSelectedUser === userId ? null : userId));
  };

  return (
    <div>
      <Title level={2} style={{ color: "#597ef7", marginBottom: 24 }}>
        {projectDetail?.name}
      </Title>
      <Row gutter={24}>
        <Col span={12}>
          <Card>
            <div
              className="pie-chart"
              style={{ height: "400px", width: "100%" }}
            >
              <Pie data={data} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Descriptions title="Project Details" column={1}>
              <Descriptions.Item label="Description">
                {isEditingDescription && isCurrentUserAdmin ? (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <TextArea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                    <Button
                      onClick={handleSaveDescription}
                      icon={<SaveOutlined />}
                    >
                      Save
                    </Button>
                  </Space>
                ) : (
                  <Paragraph>
                    {projectDetail?.description}
                    {isCurrentUserAdmin && (
                      <EditOutlined
                        onClick={() => setIsEditingDescription(true)}
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Paragraph>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(calculateProjectStatus())}>
                  {calculateProjectStatus()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {isEditingDueDate && isCurrentUserAdmin ? (
                  <Space>
                    <DatePicker
                      value={editedDueDate}
                      onChange={(date) => setEditedDueDate(date)}
                      format="YYYY-MM-DD"
                    />
                    <Button onClick={handleSaveDueDate} icon={<SaveOutlined />}>
                      Save
                    </Button>
                  </Space>
                ) : (
                  <Space direction="vertical">
                    <Space>
                      <CalendarOutlined /> {formatDate(projectDetail?.dueDate)}
                      {isCurrentUserAdmin && (
                        <EditOutlined
                          onClick={() => setIsEditingDueDate(true)}
                        />
                      )}
                    </Space>
                    <Text
                      type={
                        calculateDaysRemaining(projectDetail?.dueDate) < 0
                          ? "danger"
                          : "success"
                      }
                    >
                      {calculateDaysRemaining(projectDetail?.dueDate) < 0
                        ? `Overdue by ${Math.abs(
                            calculateDaysRemaining(projectDetail?.dueDate)
                          )} days`
                        : `${calculateDaysRemaining(
                            projectDetail?.dueDate
                          )} days remaining`}
                    </Text>
                  </Space>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Team Size">
                <TeamOutlined /> {projectDetail?.member_id?.length || "N/A"}
              </Descriptions.Item>
            </Descriptions>
            <Title level={4} style={{ marginTop: 16 }}>
              Project Progress
            </Title>
            <Progress percent={completionPercentage} status="active" />

            <Title level={4} style={{ marginTop: 24 }}>
              Team Members
            </Title>
            <Space wrap style={{ marginBottom: 16 }}>
              {projectDetail?.member_id?.map((member) => (
                <AntTooltip title={member.username} key={member._id}>
                  <Popconfirm
                    title={
                      <span>
                        Are you sure you want to remove <strong>{member.username.charAt(0).toUpperCase() + member.username.slice(1)}</strong> from the team?
                      </span>
                    }
                    onConfirm={() => handleRemoveTeamMember(member._id)}
                    okText="Yes"
                    cancelText="No"
                    disabled={!isCurrentUserAdmin}
                  >
                    <Avatar
                      src={member.profileImage}
                      icon={!member.profileImage && <UserOutlined />}
                      style={{
                        cursor: isCurrentUserAdmin ? "pointer" : "default",
                      }}
                    >
                      {member.username?.[0]?.toUpperCase()}
                    </Avatar>
                  </Popconfirm>
                </AntTooltip>
              ))}
            </Space>

            <Input.Search
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            {searchResults.length > 0 ? <List
              dataSource={searchResults}
              renderItem={(user) => (
                <List.Item
                  actions={[
                    <Button
                      type={selectedUser === user._id ? "primary" : "default"}
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      {selectedUser === user._id ? "Unselect" : "Select"}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={user.profileImage} />}
                    title={user.username}
                  />
                </List.Item>
              )}
            /> : null}
            <Button onClick={handleAddTeamMember} disabled={!selectedUser}>
              Add Member
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectDetail;
