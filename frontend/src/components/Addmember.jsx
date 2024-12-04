const Addmember = ({
  data,
  handleChange,
  handleSearchClick,
  handleUserClick,
  addUser,
  handleUserDelete,
  users,
  members,
  handleUpdateProject,
}) => {
  return (
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Add Member
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div className="row">
              <div className="col-12 my-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Member
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
                    style={{ textTransform: "capitalize" }}
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
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onClick={handleUpdateProject}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addmember;
