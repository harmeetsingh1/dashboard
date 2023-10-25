import React, { useState, useRef } from "react";

const CSVUploader = () => {
  const [csvData, setCSVData] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    parseCSV(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    parseCSV(file);
  };

  const handleDropzoneClick = () => {
    fileInputRef.current.click();
  };

  const parseCSV = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      
      setCSVData(result.message);
    } catch (error) {
      console.error("Error uploading data:", error);
    }

   
  };

  return (
    <div className="max-w-4xl ml-96 pl-32 mt-48 flex justify-center flex-col">
      <div class="flex items-center justify-center w-full ">
        <div
          className="csv-uploader  flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-200 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-200 dark:hover:border-gray-200 dark:hover:bg-gray-200"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleDropzoneClick}
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <svg
              class="w-16 h-16 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="text-lg">
              Drag and drop a CSV file or click to select one.
            </p>
            <p className="text-md text-gray-500 dark:text-gray-400">
              Upload CSV file Only.
            </p>
          </div>
        </div>
      </div>

      <div className="m-2 p-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => fileInputRef.current.click()}
        >
          Select CSV File
        </button>
        {/* <button onClick={() => parseCSV(csvData)}>Upload to MySQL</button> */}

       

        
        
        {csvData && (
          <div>
            <h2>Parsed CSV Data</h2>
            <pre>{JSON.stringify(csvData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVUploader;