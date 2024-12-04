import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Infinity } from "lucide-react";
import UserSetting from "./UserSetting";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  const [userData, setUserData] = useState({});

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { authorization: `Bearer ${token}` },
  });

  const getMyProfile = () => {
    api
      .get("/getMyProfile")
      .then((res) => {
        setUserData(res?.data);
      })
      .catch((err) => {
        console.log(err?.message);
      });
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top">
        <Link className="navbar-brand ps-2" to="/home">
          <span>
            <Infinity />
          </span>{" "}
          CollabSphere
        </Link>
        <button
          className="nav-link"
          id="navbarDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {userData?.profileImage ? (
            <img
              className="userImage"
              src={userData?.profileImage}
              alt=""
              height={50}
            />
          ) : (
            <img className="userImage" src="avatar.svg" alt="" height={50} />
          )}
        </button>

        <UserSetting handleLogOut={handleLogOut} />
      </nav>
    </div>
  );
};

export default Navbar;
