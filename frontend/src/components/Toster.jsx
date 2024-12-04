import React from "react";

export const ErrorToster = (props) => {
  // console.log("error props :",props);
  setTimeout(() => {
    props.setShow(false);
  }, 3000);

  return (
    <>
      {props.show && props.message ? (
        <div
          className={`toast d-block ${props.position} position-fixed error-message`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <span>
                <i className="fa-solid fa-circle-xmark pe-2"></i>
              </span>
              {props.message}{" "}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const SuccessToster = (props) => {
  // console.log("success props :",props);
  setTimeout(() => {
    props.setShow(false);
  },3000);

  return (
    <>
      {props.show && props.message ? (
        <div
          className={`toast d-block ${props.position} position-fixed success-message`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <i className="fa-solid fa-circle-check pe-2"></i>
              {props.message}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const WarningToster = (props) => {
  return (
    <>
      {props.message ? (
        <div
          className={`toast d-block ${props.position} warning-message`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          // data-bs-autohide="true"
          // data-bs-delay="3000"
        >
          <div className="d-flex">
            <div className="toast-body">{props.message}</div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      ) : null}
    </>
  );
};
