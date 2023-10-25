import React from "react";
import AddDeleteTableRows from "./AddDeleteTableRows";


function Question() {

  const handleSave = (data) => {
    // Implement the logic to save the data here
    // For example, you can send the data to a server or store it locally
    console.log('Data to be saved:', data);
    // Replace the above console.log with the appropriate save logic.
  };
  return (
    <div className="p-4 sm:ml-64 mt-20">
      <div className=" p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <AddDeleteTableRows />
        <div className="container flex justify-end mt-5 ">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-1/7 " onClick={handleSave}>
          SAVE
        </button>
        </div>
      </div>
    </div>
  );
}

export default Question;
