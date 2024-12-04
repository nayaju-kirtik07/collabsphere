import React from "react";
import { AlignLeft, AppWindow } from "lucide-react";

const DetailModal = (props) => {
  const { data } = props;
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header task-model-header">
            <div style={{ alignItems: "center", display: "flex" }}>
              <AppWindow />
              &nbsp;
              <h1 className="modal-heading modal-title" id="exampleModalLabel">
                {data?.name}
              </h1>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h6 className="heading">
              <span className="description-icon pe-2">
                <AlignLeft />
              </span>
              Description
            </h6>
            <p className="container-fluid ms-3">{data?.description}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
