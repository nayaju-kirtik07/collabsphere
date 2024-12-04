import React from "react";

const Table = (props) => {
  const renderHeader = () => {
    return (
      <tr className="table-header">
        <th>SN</th>
        {props.headers.map(({ title, keys }) => {
          return (
            <>
              <th key={keys}>{title}</th>
            </>
          );
        })}
        {/* {props.action ? <th>Actions</th> : null} */}
      </tr>
    );
  };

  const renderBody = () => {
    return props.data?.map((data, index) => (
      <tr>
        <td className="table-data ps-3" key={index}>
          {index + 1}
        </td>
        {props.headers?.map((header, keys) => {
          if (header?.render) {
            return (
              <td className="table-data" key={keys}>
                {header.field === 'profileImage' ? (
                  <img 
                    src={data[header.field] || 'avatar.svg'} 
                    alt="" 
                    className="table-user-image"
                  />
                ) : (
                  header.render(data)
                )}
              </td>
            );
          } else {
            return <td key={keys + 1}>{data[header.field]}</td>;
          }
        })}
      </tr>
    ));
  };

  return (
    <>
      <div className="tableDiv mt-2">
        <table className="table table-borderless " cellPadding="10">
          <thead>{renderHeader()}</thead>

          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
