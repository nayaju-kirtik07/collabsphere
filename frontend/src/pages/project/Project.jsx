import axios from "axios";
import { React, useEffect, useState } from "react";
import { Select, Button, List, Avatar } from "antd";
import {
  MessageCircleMore,
  UsersRound,
} from "lucide-react";
import { SuccessToster, ErrorToster } from "../../components/Toster";
import CreateNewProject from "../../components/modal/CreateNewProject";
import TaskDetail from "../../components/modal/TaskDetail";
import { useNavigate } from 'react-router-dom';

const Project = () => {
  const user_id = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const initialData = {
    name: "",
    description: "",
    member_id: "",
    member: "",
    dueDate: "",
    admin: true,
  };

  const container = [
    {
      id: 1,
      name: "To Do",
    },
    {
      id: 2,
      name: "Pending",
    },
    {
      id: 3,
      name: "Done",
    },
  ];

  const [data, setData] = useState(initialData); // form data
  const [projects, setProjects] = useState([]);
  const [reload, setReload] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projectid, setProjectId] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [draggedId, setDraggedId] = useState("");
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [addUser, setAddUser] = useState([]);
  const [addUserId, setAddUserId] = useState([]);
  const [singleProject, setSingleProject] = useState({});
  const [showMember, setShowMember] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  console.log("projects are..", projects);

  useEffect(() => {
    if (singleProject?.task_id) {
      setTaskList(singleProject?.task_id);
    }
  }, [singleProject]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleProjectChange = (e) => {
    setProjectId(e);
  };

  const getProjectByUserId = () => {
    console.log("user id ,", user_id)
    api
      .get(`/getprojectbyuserid/${user_id}`)
      .then((res) => {
        console.log("response are,", res);
        setProjects(res?.data);
        // setProjectId(res?.data[0]?._id);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getTaskByProjectId = () => {
    api
      .get(`/gettaskbyprojectid/${projectid}`)
      .then((res) => {
        setTasks(res?.data);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  const getUsers = () => {
    api
      .get(`/users`)
      .then((res) => {
        setUsers(res?.data);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getSingleProject = () => {
    api
      .get(`/getsingleproject/${projectid}`)
      .then((res) => {
        setSingleProject(res?.data);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(data?.member);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [data?.member]);

  useEffect(() => {
    getProjectByUserId();
  }, [reload]);

  useEffect(() => {
    getTaskByProjectId();
    getSingleProject();
  }, [projectid]);

  const handleAdd = (e) => {
    e.preventDefault();
    api
      .post(`/addproject`, { ...data, member_id: addUserId })
      .then(() => {
        setData(initialData);
        setReload(!reload);
        setSuccessMessage("Project Added successfully");
        setShow(true);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setShow(true);
      });
  };




  const onDragStart = (event, taskId) => {
    setDraggedId(taskId);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, elementName) => {
    event.preventDefault();
    const draggedTask = taskList.find((task) => task._id === draggedId);
    if (draggedTask.status !== elementName) {
      const updatedTasks = taskList.map((task) => {
        if (task._id === draggedId) {
          return { ...task, status: elementName };
        }
        return task;
      });
      setTaskList(updatedTasks);
      api
        .put(`/updatetask/${draggedId}`, {
          ...draggedTask,
          status: elementName,
        })
        .then(() => {
          console.log("update success");
        })
        .catch((err) => {
          console.error(err?.message);
        });
    }
    setDraggedId("");
  };


  useEffect(() => {
    if (debouncedInputValue) {
      const searchMember = () => {
        api
          .get(`/searchuser/${debouncedInputValue}`)
          .then((res) => {
            setMembers(res?.data);
          })
          .catch((err) => {
            console.error(err);
          });
      };

      searchMember();
    }
  }, [debouncedInputValue]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    getUsers();
  };

  const handleUserClick = (e, user) => {
    e.preventDefault();
    setData({ ...data, member: user?.username });
    setAddUserId([...addUserId, user?._id]);
    setAddUser([...addUser, user]);
    setData({ ...data, member: "" });
    setMembers([]);
  };

  const handleUserDelete = (e, id) => {
    e.preventDefault();
    const newUser = addUser?.filter((user) => user?._id !== id);
    setAddUser(newUser);
  };

  const handleMemberId = (e, id) => {
    e.preventDefault();
    setActiveUser(id);
  };

  useEffect(() => {
    if (!showMember) {
      setActiveUser("");
    }
  }, [showMember]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const handleChatClick = (e, memberId) => {
    e.stopPropagation();
    navigate('/chat', { state: { selectedUserId: memberId } });
  };

  const handleMemberClick = (e, member) => {
    e.preventDefault();
    if (singleProject.admin) {
      handleMemberId(e, member._id);
    } else {
      navigate('/chat', { state: { selectedUserId: member._id } });
    }
  };

  return (
    <div>
      <SuccessToster
        message={successMessage}
        setShow={setShow}
        show={show}
        position={"top-right"}
      />
      <ErrorToster
        message={errorMessage}
        setShow={setShow}
        show={show}
        position={"top-right"}
      />
      <div className="project-heading mb-2">
        <div className="projects-dropdown">
          <Select
            mode="single"
            placeholder="Projects"
            style={{ width: '100%' }}
            onChange={(e) => handleProjectChange(e)}

          >
            {projects.map(project => (
              <Select.Option key={project?._id} value={project?._id}>
                {project?.name}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="default"
            icon={<UsersRound size={20} />}
            onClick={() => setShowMember(!showMember)}
            className="mx-2"
          >
            {showMember ? "Hide Member" : "Show Member"}
          </Button>

        </div>

        <CreateNewProject users={users} reload={reload} setReload={setReload} />

      </div>{" "}
      <div className=" home-container">
        {showMember && (
          <div className="memberList mt-1">
            <List
              header={<div>Members</div>}
              dataSource={singleProject.member_id}
              renderItem={(member) => (
                <List.Item
                  key={member._id}
                  onClick={(e) => handleMemberClick(e, member)}
                  className="member-item"
                  style={{ cursor: 'pointer' }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={member?.profileImage} />}
                    title={member?.username}
                  />
                  <Button
                    icon={<MessageCircleMore size={20} />}
                    type="text"
                    onClick={(e) => handleChatClick(e, member._id)}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
        {container?.map((element) => (
          <div
            key={element?.id}
            className="card home-card "
            onDragOver={onDragOver}
            onDrop={(event) => onDrop(event, element?.name)}
          >
            <h5 className="card-heading  ps-3 pb-3">{element?.name}</h5>
            {activeUser ? (
              <div>
                {taskList
                  .filter((elem) => elem.project_id === projectid)
                  .filter((elem) => elem?.member_id === activeUser)

                  ?.filter((elem) => elem.status === element?.name)
                  .map((task) => {
                    return (
                      <div
                        className="card task-card mx-2 my-2"
                        onClick={() => handleOpenModal(task)}
                        draggable={true} // {{ edit_1 }} Make task draggable
                        onDragStart={(event) => onDragStart(event, task._id)} // {{ edit_2 }} Add drag start event
                      >


                        <p>{task?.name}</p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div>
                {taskList
                  .filter((elem) => elem.status === element?.name)
                  .map((task) => {
                    return (
                      <div
                        className="card task-card mx-2 my-2"
                        type="button"
                        onClick={() => handleOpenModal(task)}
                        draggable={true} // {{ edit_1 }} Make task draggable
                        onDragStart={(event) => onDragStart(event, task._id)}

                      >
                        <p>{task.name}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      </div>
      <TaskDetail
        visible={isModalVisible}
        onClose={handleCloseModal}
        task={selectedTask}
        isAdmin={true}
      />
    </div>
  );
};

export default Project;
