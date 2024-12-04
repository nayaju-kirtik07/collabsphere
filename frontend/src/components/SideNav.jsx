import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Home,
  ClipboardList,
  Kanban,
  Menu,
  Infinity,
} from "lucide-react";

const SideNav = () => {
  const location = useLocation();
  const [isSidenavVisible, setIsSidenavVisible] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsSidenavVisible(!isSidenavVisible);
  };
  const menu = [ {
    title: "Project",
    icon: (
      <>
        <Kanban />
      </>
    ),
    link: "/project",
  },
    {
      title: "Team",
      icon: (
        <>
          {" "}
          <Users />{" "}
        </>
      ),
      link: "/team",
    },
    {
      title: "Task",
      icon: (
        <>
          <ClipboardList />
        </>
      ),
      link: "/task",
    },
   
  ];

  return (
    <div className="container menu">
      <div className="toggle-menu" onClick={handleToggle}>
        <Menu />
      </div>
      <div className="heading">
        <h1 className="menu-heading py-2">
          <Infinity size={55} />
        </h1>
      </div>

      <div className="menu-datas">
        <div className="menu-item">
          <ul className="menu-ul ">
            <NavLink
              className="link-menu"
              to={"/home"}
              isactive={() => location.pathname === "/home"}
            >
              <li
                className={`menu-li ${
                  location.pathname === "/home" ? "active" : ""
                }`}
                name="Dashboard"
              >
                <Home /> <span className="menu-title ms-2">Dashboard</span>
              </li>
            </NavLink>
          </ul>
        </div>
        {menu
          .sort((x, y) => x.title.toLowerCase() > y.title.toLowerCase())
          .map((element, keys) => {
            const { title, icon, link } = element;
            return (
              <div className="menu-item" key={keys}>
                <ul className="menu-ul ">
                  <NavLink
                    className="link-menu"
                    to={link}
                    isactive={() => location.pathname === link}
                  >
                    <li
                      className={`menu-li ${
                        location.pathname === link ? "active" : ""
                      }`}
                      name={title}
                    >
                      {" "}
                      {icon} <span className="menu-title ms-2">{title}</span>
                    </li>
                  </NavLink>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SideNav;
