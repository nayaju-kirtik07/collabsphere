import Validation from "./Validation";

const AddProjectForm = ({
  data,
  handleAdd,
  handleChange,
  handleCloseModal,
  handleSearchClick,
  handleUserClick,
  handleUserDelete,
  users,
  addUser,
  members,
}) => {
  return (
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog editModule add-project-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Add Project
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeModal"
              onClick={(e) => handleCloseModal(e)}
            ></button>
          </div>
          <div className="container modal-body edit-form my-3">
            <form className="mt-4">
              <div className="row">
                <div className="col-6 my-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Name <Validation />
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    className="form-control input-field"
                    id="formControlName"
                    name="name"
                    value={data?.name}
                    onChange={(e) => handleChange(e)}
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <div className="col-6 my-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Due Date <Validation />
                  </label>{" "}
                  <br />
                  <div className="member-container">
                    <input
                      type="date"
                      className="form-control input-field"
                      id="formControlName"
                      name="dueDate"
                      value={data?.dueDate}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 my-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Member <Validation />
                  </label>{" "}
                  <br />
                  <div className="member-container">
                    <input
                      type="text"
                      className="form-control input-field mb-3"
                      id="formControlName"
                      name="member"
                      value={data?.member}
                      onChange={(e) => handleChange(e)}
                      onClick={(e) => handleSearchClick(e)}
                      placeholder="Search Member"
                      required
                    />
                    {addUser?.length > 0
                      ? addUser?.map((user) => {
                          return (
                            <span className="members p-2 mx-1 d-inline">
                              {user?.username} &nbsp;
                              <sup
                                role="button"
                                className="remove-user "
                                onClick={(e) => handleUserDelete(e, user?._id)}
                              >
                                x
                              </sup>
                            </span>
                          );
                        })
                      : null}
                  </div>
                  {!data?.member.length ? (
                    <div className="search-result mt-3">
                      {users.slice(0, 5)?.map((user, keys) => {
                        return (
                          <li
                            className="user-list ps-3"
                            key={keys}
                            role="button"
                            onClick={(e) => handleUserClick(e, user)}
                          >
                            {user?.username}
                          </li>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="search-result mt-3">
                      {members?.map((member, keys) => {
                        return (
                          <>
                            <li
                              className="user-list "
                              key={keys}
                              role="button"
                              onClick={(e) => handleUserClick(e, member)}
                            >
                              {member?.username}
                            </li>
                          </>
                        );
                      })}
                    </div>
                  )}
                  {!members?.length && data?.member.length ? (
                    <div>
                      <p style={{ textAlign: "center", opacity: ".5" }}>
                        Not Found
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* <div>
                <input
                  class="form-check-input"
                  type="checkbox"
                  value={isAdmin}
                  id="defaultCheck1"
                  onChange={() => setIsAdmin(!isAdmin)}
                />
                <label class="form-check-label ms-2 pb-1" for="defaultCheck1">
                  Admin
                </label>
              </div> */}
              <div className="my-3">
                <label htmlFor="formControlDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control input-field product-discription"
                  id="formControlDeascription"
                  name="description"
                  value={data?.description}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  placeholder="Enter Project Details"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={(e) => handleCloseModal(e)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="add-btn btn btn-primary "
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
  );
};

export default AddProjectForm;
