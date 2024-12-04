import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Modal, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";

export default function Dashboard() {
  const user_id = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  const checkProjectStatus = async (project) => {
    try {
      const tasksResponse = await api.get(`/gettaskbyprojectid/${project._id}`);
      const tasks = tasksResponse.data;

      if (!tasks || tasks.length === 0)
        return { ...project, status: "pending" };

      const allTasksCompleted = tasks.every((task) => task.status === "Done");

      if (allTasksCompleted && project.status !== "completed") {
        await api.put(`/updateproject/${project._id}`, { status: "completed" });
        return { ...project, status: "completed" };
      } else if (!allTasksCompleted && project.status === "completed") {
        await api.put(`/updateproject/${project._id}`, { status: "pending" });
        return { ...project, status: "pending" };
      }

      return project;
    } catch (error) {
      console.error("Error checking project status:", error);
      return project;
    }
  };

  const getProjectByUserId = async () => {
    try {
      const response = await api.get(`/getprojectbyuserid/${user_id}`);
      const projectsData = response.data;

      const updatedProjects = await Promise.all(
        projectsData.map((project) => checkProjectStatus(project))
      );

      setProjects(updatedProjects);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    getProjectByUserId();
  }, []);

  const handleClick = (e, element) => {
    e.preventDefault();
    navigate(`/project-detail/${element._id}`);
  };

  const handleDeleteProject = async (projectId) => {
    Modal.confirm({
      title: "Delete Project",
      content: "Are you sure you want to delete this project?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await api.delete(`/deleteproject/${projectId}`);
          message.success("Project deleted successfully");
          getProjectByUserId();
        } catch (error) {
          message.error("Failed to delete project");
          console.error(error);
        }
      },
    });
  };

  const completedProjects = projects?.filter(
    (project) => project.status === "completed"
  );
  const pendingProjects = projects?.filter(
    (project) => project.status === "pending" || !project.status
  );

  return (
    <div>
      <div>
        <h4 className="mb-3" style={{ color: "#ffbc11" }}>
          Pending Projects
        </h4>
        <div className="row dashboard">
          {pendingProjects?.map((project) => (
            <div
              className=" col-3 mb-3"
              key={project._id}
              onClick={(e) => handleClick(e, project)}
            >
              <div className="pending-project dashboard-show card position-relative">
                {project.admin && (
                  <div
                    className="position-absolute"
                    style={{ top: "8px", right: "8px", zIndex: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "delete",
                            label: "Delete",
                            onClick: (e) => {
                              if (e && e.domEvent) {
                                e.domEvent.stopPropagation();
                              }
                              handleDeleteProject(project._id);
                            },
                            style: { color: "#ff4d4f" },
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <MoreOutlined
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "white",
                        }}
                      />
                    </Dropdown>
                  </div>
                )}
                <div className="d-flex justify-content-center align-items-center">
                  <h5 className="card-title mb-0">{project?.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="mt-3" style={{ color: "#138636" }}>
          Completed Projects
        </h4>
        <div className="row dashboard">
          {completedProjects?.map((project) => (
            <div
              className="col-3 mt-3"
              key={project._id}
              onClick={(e) => handleClick(e, project)}
            >
              <div className="completed-project dashboard-show card position-relative">
                {project.admin && (
                  <div
                    className="position-absolute"
                    style={{ top: "8px", right: "8px", zIndex: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "delete",
                            label: "Delete",
                            onClick: (e) => {
                              if (e && e.domEvent) {
                                e.domEvent.stopPropagation();
                              }
                              handleDeleteProject(project._id);
                            },
                            style: { color: "#ff4d4f" },
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <MoreOutlined
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "white",
                        }}
                      />
                    </Dropdown>
                  </div>
                )}
                <div className="d-flex justify-content-center align-items-center">
                  <h5 className="card-title mb-0">{project?.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
