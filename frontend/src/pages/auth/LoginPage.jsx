import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuccessToster, ErrorToster } from "../../components/Toster";
import { Infinity } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const initialData = {
    email: "",
    password: "",
  };

  const [data, setData] = useState(initialData);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/login`,
      data: {
        ...data,
      },
    })
      .then((res) => {
        setData(initialData);
        localStorage.setItem("user", JSON.stringify(res?.data?.userId));
        localStorage.setItem("token", JSON.stringify(res?.data?.refresh_token));
        setShow(true);
        setSuccessMessage("Login Success");
        navigate("/home",{state:{isLogging:true}});
      })
      .catch((err) => {
        console.error(err);
        setShow(true);
        setErrorMessage(err?.message);
      });
  };

  const hadnleCreateAccount = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="container-fluid login   mx-auto">
      <SuccessToster
        message={successMessage}
        show={show}
        position={"top-right"}
        setShow={setShow}
      />
      <ErrorToster
        message={errorMessage}
        show={show}
        position={"top-right"}
        setShow={setShow}
      />
      <div className="card login-container ">
        <div className="container-login ">
          <div className="login-heading mb-5">
            {/* <h1 className="system-name mb-5">CollabSphere</h1> */}
            <Infinity size={64} />
            <h4 className="log-In mt-3">Welcome back!</h4>
            <p className="">Please login to your account</p>
          </div>
          <form>
            <div className="form-outline mb-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                name="email"
                value={data.email}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="form-outline mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <button
              type="button"
              className="login-btn btn btn-primary mb-4"
              onClick={(e) => handleSubmit(e)}
            >
              Log in
            </button>
          </form>
        </div>

        <div className="sing-up">
          <p className="mb-2">Don't have an account yet?</p>{" "}
          <b className="create-account" onClick={(e) => hadnleCreateAccount(e)}>
            Create an account
          </b>
        </div>
      </div>
      <div className="illustration-container mx-auto">
        <img
          src="login-illustration.svg"
          alt="Login Illustraion"
          height={500}
          width={500}
        />
      </div>
    </div>
  );
};

export default Login;
