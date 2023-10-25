import React, { useState } from "react";
import TableRows from "./TableRows";

function AddDeleteTableRows() {
  const [rowsData, setRowsData] = useState([]);

  const addTableRows = () => {
    const rowsInput = {
      SrNo: "",
      QuestionDescription: "",
      Options: [
        { label: "", weightage: "" },
        { label: "", weightage: "" },
        { label: "", weightage: "" },
        { label: "", weightage: "" },
      ],
    };
    setRowsData([...rowsData, rowsInput]);
  };

  const deleteTableRows = (index) => {
    const updatedRowsData = rowsData.filter((_, i) => i !== index);
    setRowsData(updatedRowsData);
  };

  const handleChange = (index, name, value) => {
    setRowsData((prevRowsData) => {
      const updatedRowsData = [...prevRowsData];
      if (name === "SrNo" || name === "QuestionDescription") {
        updatedRowsData[index][name] = value;
      } else {
        const [property, subIndex, subProperty] = name.split(".");
        if (property === "Options") {
          updatedRowsData[index][property][subIndex][subProperty] = value;
        }
      }
      return updatedRowsData;
    });
  };
  



  return (
    <div className="container flex justify-center overflow-scroll">
      <div className="row ">
        <div className="col-sm-12">
          <table className="table ">
            <thead className="">
              <tr className="want">
                <th className="">Sr.No.</th>
                <th className="">Question Description</th>
                <th className="w-1/4 ">Options</th>
                <th className="">Weightage</th>
                <th>
                  <button
                    className="btn btn-outline-success"
                    onClick={addTableRows}
                  >
                    +
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <TableRows
                rowsData={rowsData}
                deleteTableRows={deleteTableRows}
                handleChange={handleChange}
              />
            </tbody>
          </table>
        </div>
        <div className="col-sm-4"></div>
      </div>
    </div>
  );
}

export default AddDeleteTableRows;
