import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const initialData = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    c_password: "",
  };

  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/signup`,
      data: { ...data },
    }).then(() => {
      setData(initialData);
      navigate("/");
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className="container-fluid signup   ">
      <div className="illustration-container mx-auto">
        <img
          src="signup-illustration.svg"
          alt="Login Illustraion"
          height={500}
          width={500}
        />
      </div>
      <div className="card signup-container p-3">
        <div className="container-login ">
          <div className="signup-heading mb-5">
            <h4 className="log-In">Welcome back!</h4>
            <p className="">Register your account to manage your task!</p>
          </div>
          <form>
            <div className="form-outline row mb-4">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control "
                  placeholder="First Name"
                  name="first_name"
                  value={data.first_name}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="col-6">
                <input
                  type="text"
                  className="form-control col-6"
                  placeholder="Last Name"
                  name="last_name"
                  value={data.last_name}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="form-outline mb-4">
              <input
                type="text"
                className="form-control col-6"
                placeholder="Username"
                name="username"
                value={data.username}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="form-outline mb-4">
              <input
                type="email"
                className="form-control col-6"
                placeholder="Email"
                name="email"
                value={data.email}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="form-outline mb-4">
              <input
                type="password"
                className="form-control col-6"
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="form-outline mb-4">
              <input
                type="password"
                className="form-control col-6"
                placeholder="Confirm Password"
                name="c_password"
                value={data.c_password}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <button
              type="button"
              className="login-btn btn btn-primary mb-4"
              onClick={(e) => handleSubmit(e)}
            >
              Sign In
            </button>

            <div className="sing-up">
              <p className="mb-2">
                Already have an account?{" "}
                <span className="ps-2">
                  <b className="create-account" onClick={() => navigate("/")}>
                    Login
                  </b>
                </span>
              </p>{" "}
            </div>
          </form>
        </div>

        {/* <div className="sing-up">
        <p className="mb-2">Don't have an account yet?</p>{" "}
        <b className="create-account" onClick={(e) => hadnleCreateAccount(e)}>Create an account</b>
      </div> */}
      </div>
    </div>
  );
};

export default SignupPage;
