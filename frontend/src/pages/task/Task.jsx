import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../components/Table";
import { Plus } from "lucide-react";
import AddTaskForm from "../../components/AddTaskForm";

const Task = () => {
  const user_id = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  const headers = [
    {
      title: "Name",
      field: "name",
      render: (data) => <>{data?.name}</>,
    },
    {
      title: "Project",
      field: "project_id",
      render: (data) => <>{data?.project_id?.name}</>,
    },
    {
      title: "Member",
      field: "member_id",
      render: (data) => (
        <div style={{ textTransform: "capitalize" }}>
          <span>
            <img
              className="profile-image me-2"
              src={data?.member_id?.profileImage}
              alt=""
              height={30}
              style={{ borderRadius: "50%" }}
            />
          </span>
          {data?.member_id?.username}
        </div>
      ),
    },
    {
      title: "Status",
      field: "status",
      render: (data) => <> {data?.status} </>,
    },
    {
      title: "Description",
      field: "description",
      render: (data) => <>{data?.description}</>,
    },
  ];

  const initialData = {
    name: "",
    description: "",
    status: "",
    member_id: "",
    project_id: "",
    member: "",
  };

  const [task, setTask] = useState([]);
  const [data, setData] = useState(initialData);
  const [reload, setReload] = useState(false);
  const [project, setProject] = useState([]);
  const [projectid, setProjectId] = useState("");
  const [user, setUser] = useState([]);
  const [member, setMember] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [nameValidate, setNameValidate] = useState("");
  const [statusValidate, setStatusValidate] = useState("");
  const [memberValidate, setMemberValidate] = useState("");
  const [showUser, setShowUser] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "project_id") {
      setProjectId(e.target.value);
    }

    setData({ ...data, [name]: value });
    setNameValidate("");
    setStatusValidate("");
    setMemberValidate("");
  };

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  const getProjectByUserId = () => {
    api
      .get(`/getprojectbyuserid/${user_id}`)
      .then((res) => {
        setProject(res?.data);
        setProjectId(res?.data[0]._id);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  const getAllUser = () => {
    api
      .get(`/users`)
      .then((res) => {
        setUser(res?.data);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  const getTaskByUserId = () => {
    api
      .get(`/gettaskbyuserid/${user_id}`)
      .then((res) => {
        setTask(res?.data);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };
  console.log("task are.....", task);

  const searchMember = () => {
    api
      .get(`/searchuser/${data?.member}`)
      .then((res) => {
        setMember(res?.data);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  const addTask = () => {
    api
      .post(`/addtask`, {
        ...data,
        project_id: projectid,
        member_id: memberId,
      })
      .then((res) => {
        setReload(!reload);
        setData(initialData);
        document.getElementById("closeModal").click();
        setUser([]);
        setMember([]);
      })
      .catch((err) => {
        console.error(err?.message);
      });
  };

  useEffect(() => {
    getProjectByUserId();
    getAllUser();
  }, []);

  useEffect(() => {
    getTaskByUserId();
  }, [user_id, reload]);

  useEffect(() => {
    searchMember();
  }, [data?.member]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    setShowUser(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (data?.name === "") {
      setNameValidate("Task name is required");
    } else if (data?.status === "") {
      setStatusValidate("Status is required");
    } else if (data?.member === "") {
      setMemberValidate("Assign a member");
    }
    addTask();
  };

  const handleModalClose = (e) => {
    e.preventDefault();
    setData(initialData);
    setUser([]);
    setMember([]);
    setNameValidate("");
    setStatusValidate("");
    setMemberValidate("");
  };

  const handleUserClick = (e, element) => {
    e.preventDefault();
    setMemberId(element?._id);
    setMember([]);
    setUser([]);
    setData({ ...data, member: element?.username });
  };

  return (
    <div className="task">
      <div className="task-header">
        <div className="task-heading">Task</div>
        <button
          type="button"
          className="add-project-btn btn btn-primary "
          data-bs-toggle="modal"
          data-bs-target="#editModal"
        >
          <span className="me-1 mb-1">
            <Plus />{" "}
          </span>
          Add Task
        </button>
      </div>

      <Table headers={headers} data={task} />

      <AddTaskForm
        handleAdd={handleAdd}
        nameValidate={nameValidate}
        data={data}
        handleChange={handleChange}
        statusValidate={statusValidate}
        project={project}
        memberValidate={memberValidate}
        handleSearchClick={handleSearchClick}
        showUser={showUser}
        member={member}
        user={user}
        handleUserClick={handleUserClick}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default Task;
