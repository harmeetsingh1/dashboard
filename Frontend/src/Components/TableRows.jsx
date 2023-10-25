import React from "react";

function TableRows({ rowsData, deleteTableRows, handleChange }) {
  return rowsData.map((data, index) => {
    const { SrNo, QuestionDescription, Options } = data;
    return (
      
      <tr key={index}  >
       
        <td>
          <input
            type="number"
            value={SrNo}
            onChange={(evnt) => handleChange(index, "SrNo", evnt.target.value)}
            name="SrNo"
            className="form-control 
            mt-3 mb-3
            "
          />
        </td>
        <td className="w-1/2">
          <textarea
            type="text"
            value={QuestionDescription}
            onChange={(evnt) =>
              handleChange(index, "QuestionDescription", evnt.target.value)
            }
            name="QuestionDescription"
            className="form-control mt-3 mb-3 "
          />
        </td>

        <td className="">
          {Options.map((option, optionIndex) => (
            <input
              key={optionIndex}
              type="text"
              value={option.option}
              onChange={(evnt) =>
                handleChange(
                  index,
                  `Options.${optionIndex}.option`,
                  evnt.target.value
                )
              }
              name={`Options.${optionIndex}.option`}
              className="form-control
              mb-3 mt-3"
            />
          ))}
        </td>
        <td>
          {Options.map((option, optionIndex) => (
            <input
              key={optionIndex}
              type="number"
              value={option.weightage}
              onChange={(evnt) =>
                handleChange(
                  index,
                  `Options.${optionIndex}.weightage`,
                  evnt.target.value
                )
              }
              name={`Options.${optionIndex}.weightage`}
              className="form-control mb-3 mt-3"
            />
          ))}
        </td>

        <td>
          <button
            className="btn btn-outline-danger mt-3 mb-3"
            onClick={() => deleteTableRows(index)}
          >
            x
          </button>
        </td>
        
      </tr>
     
    );
  });
}

export default TableRows;
