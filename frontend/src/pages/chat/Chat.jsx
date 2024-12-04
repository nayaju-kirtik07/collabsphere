import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  List,
  Input,
  Button,
  Typography,
  Avatar,
  Modal,
  Select,
  message,
} from "antd";
import {
  SendOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import { useOutletContext } from 'react-router-dom';

const { Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

const ChatLayout = styled(Layout)`
  height: 100vh;
`;

const Sider = styled(Layout.Sider)`
  background: #fff;
  border-right: 1px solid #e8e8e8;
`;

const ChatList = styled(List)`
  height: calc(100vh - 64px);
  overflow-y: auto;
`;

const ChatWindow = styled(Content)`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  margin-bottom: 16px;
`;

const MessageItem = styled(List.Item)`
  padding: 8px 0;
`;

const SentMessage = styled.div`
  background-color: #1890ff;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
  align-self: flex-end;
  margin-left: auto;
`;

const ReceivedMessage = styled.div`
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  gap: 20px;
`;

const OnlineIndicator = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: green; // Green color for online status
  position: absolute; // Position it absolutely
  bottom: 0; // Align to the bottom
  right: 0; // Align to the right
  border: 2px solid white; // Optional: add a border for better visibility
`;

const AvatarContainer = styled.div`
  position: relative; // Set position to relative for absolute positioning of the indicator
  display: inline-block; // Ensure it wraps around the avatar
`;

const Chat = () => {
  const { socket, activeUsers } = useOutletContext();
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const user_id = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));
  const [typingUsers, setTypingUsers] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (message) => {
      console.log("message received", message);
      if (message.content) {
        setMessages((prevMessages) => {
          const chatId = message.senderId === user_id ? message.receiverId : message.senderId;
          
          return {
            ...prevMessages,
            [chatId]: [
              ...(prevMessages[chatId] || []),
              {
                _id: message._id,
                senderId: message.senderId,
                message: message.content,
                timestamp: message.timestamp,
              },
            ],
          };
        });
      }
    });

    socket.on("user_typing", (data) => {
      setTypingUsers((prev) => ({ ...prev, [data.user]: true }));
      setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [data.user]: false }));
      }, 5000);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [socket]);

  useEffect(() => {
    getUserWithConnections();
  }, []);

  const getUserWithConnections = async () => {
    try {
      const response = await api.get(`/users/${user_id}/connections`);
      setConnectedUsers(response.data.connections);
    } catch (error) {
      console.error("Error fetching user connections:", error);
      message.error("Failed to load connected users");
    }
  };

  useEffect(() => {
    try {
      console.log(searchTerm);
      api
        .get(`/searchuser/${searchTerm}`)
        .then((response) => {
          console.log(response);
          setSearchResults(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error searching users:", error);
      message.error("Failed to search users");
    }
  }, [searchTerm]);

  const connectWithUser = async (userId) => {
    try {
      await api.post(`/users/${user_id}/connect`, { connectionId: userId });
      message.success("Connected successfully");
      getUserWithConnections();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error connecting with user:", error);
      message.error("Failed to connect with user");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage && activeChat) {
      const newMessage = {
        sender: user_id,
        receiver: activeChat,
        content: inputMessage,
      };

      console.log("while sending", newMessage);

      // Only emit the message to the server
      socket.emit("send_message", newMessage);

      // Clear input immediately for better UX
      setInputMessage(""); 
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { user: user_id });
  };

  const startChat = async (userId) => {
    setActiveChat(userId);
    if (!messages[userId]) {
      setLoading(true);
      try {
        const response = await api.get(`/messages/${user_id}/${userId}`);
        console.log(response.data);
        const messages = response.data;
        setMessages((prevMessages) => ({
          ...prevMessages,
          [userId]: messages,
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
        message.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ChatLayout>
      <Sider width={300} style={{ background: "#fff" }}>
        <div style={{ padding: "16px" }}>
          <Button
            icon={<UserAddOutlined />}
            onClick={showModal}
            style={{ width: "100%", marginBottom: 16 }}
          >
            New Chat
          </Button>
        </div>
        <ChatList
          dataSource={connectedUsers}
          renderItem={(user) => (
            <List.Item
              onClick={() => startChat(user?._id)}
              style={{ cursor: "pointer", padding: "12px 16px" }}
              className={activeChat === user?._id ? "ant-list-item-active" : ""}
            >
              <List.Item.Meta
                avatar={
                  <AvatarContainer>
                    <Avatar src={user?.profileImage} />
                    {activeUsers.includes(user?._id) && (
                      <OnlineIndicator />
                    )}{" "}
                    {/* Show online indicator */}
                  </AvatarContainer>
                }
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {activeUsers.includes(user?._id)}{" "}
                    {/* Show online indicator */}
                    <span style={{}}>{user?.username}</span>
                  </div>
                }
                description={
                  <span>
                    {activeUsers.includes(user?._id) ? "Online" : "Offline"}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Sider>
      <ChatWindow>
        {activeChat ? (
          <>
            {/* New section for displaying receiver's avatar, name, and online status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Avatar
                src={
                  connectedUsers.find((user) => user._id === activeChat)
                    ?.profileImage
                }
                style={{ marginRight: "8px" }}
              />
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {
                  connectedUsers.find((user) => user._id === activeChat)
                    ?.username
                }
              </span>
            </div>

            <MessagesContainer>
              <List
                loading={loading}
                dataSource={messages[activeChat] || []}
                renderItem={(msg) => (
                  <MessageItem key={msg._id}>
                    {msg.senderId === user_id ? (
                      <SentMessage>
                        <Text>{msg.message}</Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: "12px", marginTop: "4px" }}
                        >
                          {moment(msg.timestamp).format("HH:mm")}
                        </Text>
                      </SentMessage>
                    ) : (
                      <ReceivedMessage>
                        <Avatar
                          src={
                            connectedUsers.find(
                              (user) => user._id === activeChat
                            )?.profileImage
                          }
                          style={{ marginRight: "8px" }}
                        />
                        <Text>{msg.message}</Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: "12px", marginTop: "4px" }}
                        >
                          {moment(msg.timestamp).format("HH:mm")}
                        </Text>
                      </ReceivedMessage>
                    )}
                  </MessageItem>
                )}
              />
              <div ref={messagesEndRef} />
              {typingUsers[activeChat] && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Avatar
                    src={
                      connectedUsers.find((user) => user._id === activeChat)
                        ?.profileImage
                    }
                    style={{ marginRight: "8px" }}
                  />
                  <Text type="secondary" italic>
                    {
                      connectedUsers.find((user) => user._id === activeChat)
                        ?.username
                    }{" "}
                    is typing...
                  </Text>
                </div>
              )}
            </MessagesContainer>
            <InputContainer>
              <Input.TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onPressEnter={sendMessage}
                onKeyPress={handleTyping}
                placeholder="Type a message..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                style={{ marginBottom: 8 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
              >
                Send
              </Button>
            </InputContainer>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text>Select a chat to start messaging</Text>
          </div>
        )}
      </ChatWindow>
      <Modal
        title="Start New Chat"
        visible={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
      >
        <Search
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
          enterButton={<SearchOutlined />}
        />
        <List
          dataSource={searchResults}
          renderItem={(user) => (
            <List.Item
              actions={[
                <Button onClick={() => connectWithUser(user._id)}>
                  Connect
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={user.profileImage} />}
                title={user.username}
              />
            </List.Item>
          )}
        />
      </Modal>
    </ChatLayout>
  );
};

export default Chat;
