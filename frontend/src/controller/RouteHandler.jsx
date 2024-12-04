  import React from "react";
  import { Routes, Route } from "react-router-dom";
  import Project from "../pages/project/Project";
  import AppLayout from "../components/AppLayout";
  import Login from "../pages/auth/LoginPage";
  import SignupPage from "../pages/auth/Signup";
  import Task from "../pages/task/Task";
  import Dashboard from "../pages/dashboard/Dashboard";
  import Chat from "../pages/chat/Chat";
  import ProjectDetail from "../pages/project/ProjectDetail";
  import { ConfigProvider } from "antd";

  const RouteHandler = () => {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#597ef7',
            colorInfo: '#597ef7',
            colorSuccess: '#73d13d',
            colorWarning: '#faad14',
            colorError: '#ff4d4f',
            colorTextBase: '#262626',
            colorBgBase: '#fff',
          },
          components: {
            Layout: {
              siderBg: '#001529',  
              triggerBg: '#002140', 
            },
            Menu: {
              darkItemBg: '#001529',
              darkItemColor: '#ffffff',
              darkItemHoverBg: '#1890ff',
              darkItemSelectedBg: '#1890ff',
            },
          },
        }}
      >
        <Routes>
          <Route index element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="home" element={<Dashboard />} />
            <Route path="project" element={<Project />} />
            <Route path="task" element={<Task />} />
            <Route path="project-detail/:projectId" element={<ProjectDetail />} />
            <Route path="chat" element={<Chat />} />
          </Route>
        </Routes>
      </ConfigProvider>
    );
  };

  export default RouteHandler;
