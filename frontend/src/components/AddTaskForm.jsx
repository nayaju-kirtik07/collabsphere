import React from "react";
import Validation from "./Validation";

const AddTaskForm = ({
  handleModalClose,
  nameValidate,
  data,
  handleChange,
  statusValidate,
  project,
  memberValidate,
  handleSearchClick,
  showUser,
  member,
  user,
  handleUserClick,
  handleAdd,
}) => {
  return (
    <div>
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog editModule edit-module">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
                onClick={(e) => handleModalClose(e)}
              ></button>
            </div>
            <div className="container modal-body edit-form my-3">
              <form className="needs-validation mt-4">
                <div className="row">
                  <div className="col-6 my-3">
                    <label htmlFor="validationCustom01" className="form-label">
                      Name <Validation />
                    </label>{" "}
                    <br />
                    <input
                      type="text"
                      className={`form-control input-field ${
                        nameValidate !== "" ? "error-validate" : ""
                      }`}
                      id="validationCustom01"
                      name="name"
                      value={data?.name}
                      onChange={(e) => handleChange(e)}
                      placeholder="Enter Name"
                      required
                    />
                    <div className="error-msg">{nameValidate}</div>
                  </div>
                  <div className="status-dropdown col-6 my-3">
                    <label htmlFor="formControlStatus" className="form-label">
                      Select Status <Validation />
                    </label>
                    <select
                      className={`add-task-dropdown form-control ${
                        statusValidate !== "" ? "error-validate" : ""
                      }`}
                      id="formControlStatus"
                      name="status"
                      value={data?.status}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      <option> Select Status</option>
                      <option> Pending</option>
                      <option> To Do</option>
                      <option>Done</option>
                    </select>
                    <div className="error-msg">{statusValidate}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="status-dropdown col-6 my-3">
                    <label htmlFor="formControlProject" className="form-label">
                      Select Projects <Validation />
                    </label>
                    <select
                      className="add-task-dropdown form-control"
                      id="formControlProject"
                      name="project_id"
                      onChange={handleChange}
                    >
                      {project.map((element, keys) => {
                        return (
                          <>
                            <option key={keys} value={element._id}>
                              {element.name}
                            </option>
                          </>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-6 my-3 ">
                    <label htmlFor="formControlMember" className="form-label">
                      Member <Validation />
                    </label>{" "}
                    <br />
                    <input
                      type="text"
                      className={`form-control input-field ${
                        memberValidate !== "" ? "error-validate" : ""
                      }`}
                      id="formControlMember"
                      name="member"
                      value={data?.member}
                      onChange={(e) => handleChange(e)}
                      onClick={(e) => handleSearchClick(e)}
                      placeholder="Seacrh Member"
                      required
                    />
                    <div className="error-msg">{memberValidate}</div>
                    {showUser && !member.length ? (
                      <div className="search-result">
                        {user.slice(0, 5)?.map((element, keys) => {
                          return (
                            <li
                              className="user-list ms-3"
                              key={keys}
                              role="button"
                              onClick={(e) => handleUserClick(e, element)}
                            >
                              {element?.username}
                            </li>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="search-result">
                        {member?.map((element, keys) => {
                          return (
                            <li
                              className="user-list ms-3"
                              key={keys}
                              role="button"
                              onClick={(e) => handleUserClick(e, element)}
                            >
                              {element?.username}
                            </li>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="my-3">
                  <label
                    htmlFor="formControlDescription"
                    className="form-label"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control input-field task-discription"
                    id="formControlDeascription"
                    name="description"
                    value={data?.description}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="Enter Task Details"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={(e) => handleModalClose(e)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  handleAdd(e);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
