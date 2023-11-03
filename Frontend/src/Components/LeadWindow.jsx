import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';


function LeadWindow() {
  const [leads, setLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    Array(leads.length).fill(null)
  );

  const [selectedLeadIndex, setSelectedLeadIndex] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarOpenIndex, setCalendarOpenIndex] = useState(null);
  const [inputFieldValues, setInputFieldValues] = useState(
    Array(leads.length).fill(null)
  );

  const [remarks, setRemarks] = useState(Array(leads.length).fill(""));
  const [userNames, setUserNames] = useState([]);
  const [reloadOnce, setReloadOnce] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    // Fetch user names from the backend when the component mounts
    fetchUserNames();
  }, []);

  useEffect(() => {
    console.log("Updated Remarks:", remarks);
  }, [remarks]); 

 

  const handleRemarksChange = (value, localIndex) => {
    console.log("Handle Remarks Change Called");
    //const globalIndex = getGlobalIndex(localIndex);
    const globalIndex = startIdx + localIndex;
    setRemarks((prevRemarks) => {
      const newRemarks = [...prevRemarks];
      console.log("Remarks before update:", newRemarks);
      newRemarks[globalIndex] = value;
      console.log("Remarks after update:", newRemarks);
      console.log("Local Index:", localIndex);
      console.log("Global Index:", globalIndex);
      return newRemarks;
    });
  };
  

  const fetchUserNames = async () => {
    try {
      const response = await fetch("http://localhost:3001/user-names");
      const result = await response.json();

      if (response.ok) {
        setUserNames(result.userNames);
        
      } else {
        console.error("Error fetching user names:", result.message);
      }
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  
  
  
  useEffect(() => {
    // Initialize selectedDate based on leads data
    setSelectedDate(leads.map(() => null));

    setInputFieldValues(leads.map(() => null));

  }, [leads]);

  const itemsPerPage = 50; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(leads.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // useEffect(() => {
  //   // Check if the current page is the first page
  //   if (currentPage === 0) {
  //     // Trigger a hard refresh
  //     window.location.reload();
  //   }
  // }, [currentPage]);

  //const displayedLeads = leads.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const getGlobalIndex = (localIndex) => currentPage * itemsPerPage + localIndex;

  const startIdx = currentPage * itemsPerPage;
  const endIdx = (currentPage + 1) * itemsPerPage;
  const displayedLeads = leads.slice(startIdx, endIdx);


  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:3001/leads");
      const result = await response.json();

      console.log("Response:", response);
      console.log("Result:", result);

      if (response.ok) {
        const leadsWithSerialNumber = (result.leads || []).map(
          (lead, index) => ({
            ...lead,
            serialNumber: index + 1,
            selectedLeadStage: lead["Lead Stage"],
          })
        );
        setLeads(leadsWithSerialNumber);

        const datesFromLeads = result.leads.map((lead) =>
          lead.formatted_last_updated
            ? new Date(lead.formatted_last_updated)
            : null
        );

        console.log("front end lead dates:", datesFromLeads);

        setSelectedDate(datesFromLeads);

        const remarksFromLeads = result.leads.map((lead) => lead.Remarks || "");

        // setRemarks(remarksFromLeads);

        setRemarks(leadsWithSerialNumber.map((lead) => lead.remarks));
        //setRemarks(leadsWithSerialNumber.map((lead) => lead.someNestedProperty.remarks));

        

        console.log("Leads with serial numbers:", leadsWithSerialNumber);
      } else {
        console.error("Error fetching leads:", result.message);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleLeadStageChange = (localIndex, selectedLeadStage) => {
    // Update the leadStage value for the specific lead
    const globalIndex = getGlobalIndex(localIndex);
    setLeads((prevLeads) =>
      prevLeads.map((lead, i) =>
        i === globalIndex ? { ...lead, selectedLeadStage: selectedLeadStage } : lead
      )
    );
  };

 

  const formatDate = (date) => {
    if (!date) return null;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateChange = (date, localIndex) => {
    const globalIndex = getGlobalIndex(localIndex);
    console.log("Incoming date:", date);
    console.log("Before Update - selectedDate:", selectedDate);
    // ... rest of the code

    console.log("Type of selectedDate[localIndex]:", typeof selectedDate[globalIndex]);
    console.log("Value of selectedDate[localIndex]:", selectedDate[globalIndex]);

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid date:", date);
      return;
    }

    const timeZoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timeZoneOffset);

    const formattedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : null;

    console.log("Formatted date:", formattedDate);

    setSelectedDate((prevDates) => {
      const newDates = [...prevDates];
      newDates[globalIndex] = date;
      return newDates;
    });

    // Update the input field value using useState

    console.log("Selected date after update:", date);

    console.log("After Update - selectedDate:", selectedDate);
    setIsCalendarOpen(false);
  };

  // const handleDateChange1 = (event) => {
  //   setSelectedDate(event.target.value);
  // };

  const handleDateChange1 = (date, index) => {
    setSelectedDate((prevSelectedDate) => {
      const newSelectedDate = [...prevSelectedDate];
      newSelectedDate[index] = date;
      return newSelectedDate;
    });
  };

  

  const handleUpdateLeadStages = async (index, i) => {
    console.log("Before Update - selectedLeadIndex:", selectedLeadIndex);
    console.log("Before Update - selectedDate:", selectedDate);

    try {
      const updatedLeads = leads.map((lead, leadIndex) => {
        const compositeKey = `${lead["Name"]}_${lead["Mobile Number"]}_${lead["Email"]}`;
        const selectedDateValue = selectedDate[leadIndex];

        console.log(`Processing lead with compositeKey: ${compositeKey}`);
        console.log(`Selected date: ${selectedDateValue}`);

        const formattedDate =
          selectedDateValue instanceof Date
            ? selectedDateValue.toISOString().split("T")[0]
            : null;

 return {
          compositeKey,
          Assign_to: lead.Assign_to,
          selectedLeadStage: lead.selectedLeadStage,
          date: formattedDate,
          remarks: remarks[leadIndex],  
        };
      });

      console.log("Updated Leads:", updatedLeads);

      const response = await fetch("http://localhost:3001/update-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leads: updatedLeads }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        setLeads(
          result.updatedLeads.map((lead, index) => ({
            ...lead,
            serialNumber: index + 1,
            selectedLeadStage: lead["Lead Stage"],
            remarks: lead.remarks,
          }))

         
        );

        setSelectedDate(result.updatedLeads.map((lead) => new Date(lead.date)));
        console.log("After Update - selectedDate:", selectedDate);

        if (!reloadOnce) {
          setReloadOnce(true);
          window.location.reload();
        }
      } else {
        console.error("Error updating lead stages:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating lead stages:", error);
    }

    console.log("After Update - selectedLeadIndex:", selectedLeadIndex);
    console.log("After Update - selectedDate:", selectedDate);

    //setSelectedDate(Array(leads.length).fill(null));
    setSelectedLeadIndex(null);
  };

   

  const handleAssignToChange = (selectedUser, localIndex) => {
    // Update the assigned user for the specific lead
    const globalIndex = getGlobalIndex(localIndex);
    console.log("Selected User:", selectedUser);
  
    setLeads((prevLeads) => {
      const updatedLeads = prevLeads.map((lead, i) =>
        i === globalIndex ? { ...lead, Assign_to: selectedUser } : lead
      );
  
      console.log("Updated leads array:", updatedLeads);
  
      return updatedLeads;
    });
  };

  const filteredLeads = displayedLeads.filter((lead) => {
    // Step 2: Filter leads based on the selected filter value
    console.log('Lead Status:', lead.selectedLeadStage);
    console.log('Filter Value:', filterValue);
    //return filterValue === '' || lead.selectedLeadStage === filterValue;
    return filterValue === '' || lead.selectedLeadStage.trim() === filterValue.trim();

  });



  
  

  return (
    <div className="">
      {/* <h1 className="mt-32">Leads Window</h1> */}
      <div className="mb-4 mt-36">
        <label className="mr-2">Filter by Existing Status:</label>
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="">All</option>
          <option value="Fresh Leads">Fresh Leads</option>
          <option value="Call Received">Call Received</option>
          <option value="Call Not Received">Call Not Received</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Interested">Interested</option>
          <option value="Converted">Converted</option>
        </select>
      </div>
      {/* <h2 className='flex justify-center'>Leads</h2> */}
      <div class="overflow-x-auto tabletop ">
       <table className="table-bel ml-72 min-w-full  text-left text-sm font-dark border-collapse sticky">
       <thead className="bg-black text-white ">
          <tr className="border-r">
            
            <th  className="p-2">Sr.No.</th>
            <th  className="p-2 ">Name</th>
            <th  className="p-2 ">Mobile Number</th>
            <th  className="p-2 ">Email</th>
            <th  className="p-1 ">Assign to</th>
            <th  className="p-2 ">Existing Status</th>
            <th  className="p-2 ">Next Follow up</th>
            <th  className="p-2">Remarks</th>
          </tr>
        </thead>
        
        <tbody className="overflow-y-scroll" >
          {filteredLeads?.map((lead, index) => (
            <tr  
               key={lead.compositeKey} 
               //className="border-b dark:border-neutral-500 flex"
               className={`border-t border-gray-200 ${
                lead.selectedLeadStage === 'Not Interested'
                  ? 'bg-[#ff3333]'
                  : lead.selectedLeadStage === 'Interested'
                  ? 'bg-lime-300'
                  :  lead.selectedLeadStage === 'Call Received'
                  ? 'bg-amber-300'
                  :  lead.selectedLeadStage === 'Converted'
                  ? 'bg-cyan-300'
                  :  lead.selectedLeadStage === 'Fresh Leads'
                  ? 'bg-white'
                  :  lead.selectedLeadStage === 'Call Not Received'
                  ? 'bg-white'
                  : ''
              }`}
            >
              
              <td className="p-2">{lead.serialNumber}</td>
              <td className="p-2" >{lead["Name"]}</td>
              <td className="p-2">{lead["Mobile Number"]}</td>
              <td className="p-2">{lead.Email}</td>

              <td className="p-2">
                <select
                  value={lead.Assign_to || ""}
                  onChange={(e) => handleAssignToChange(e.target.value, index)}
                  className="w-full"
                >
            <option value="">Select User</option>
              {userNames
                    .filter((userName) => userName !== null)
                    .map((userName, index) => (
                      <option key={index} value={userName}>
                        {userName}
                      </option>
                    ))}
                </select>
              </td>

              <td className="p-2">
               
                <select
                  value={lead.selectedLeadStage}
                  onChange={(e) => handleLeadStageChange(index, e.target.value)}
                  className="w-full"
                >
                  <option value="Fresh Leads">Fresh Leads</option>
                  <option value="Call Received">Call Received</option>
                  <option value="Call Not Received">
                    Call Not Received
                  </option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Interested">Interested</option>
                  <option value="Converted">Converted</option>
                </select>
              </td>

              <td style={{ position: "relative" }} className="p-2">
                <input
                  type="text"
                  onFocus={() => {
                    setCalendarOpenIndex(index);
                    setSelectedLeadIndex(index);
                    setIsCalendarOpen(true);
                  }}
                  value={
                    lead.last_updated
                      ? new Date(lead.last_updated).toLocaleDateString()
                      : "No date Available"
                  }
                  onChange={handleDateChange1}
                  readOnly
                />

                {isCalendarOpen && calendarOpenIndex === index && (
                  <div style={{ position: "absolute", top: "100%", zIndex: 1 }}>
                    <Calendar
                      onChange={(date) => handleDateChange(date, index)}
                      value={selectedDate[index]}
                    />
                  </div>
                )}
              </td>

              <td className="p-2">
                <textarea
                  value={remarks[getGlobalIndex(index)]}
                 
                  onChange={(e) => handleRemarksChange(e.target.value, index)}
                  
                  // value={remarks[getGlobalIndex(index)]}
                  //   onChange={(e) => handleRemarksChange(e.target.value, getGlobalIndex(index))}
                  rows="3"
                  cols="30"
                  maxLength="255"
                  className="w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>



      </table>
      
      </div>

      


     <div className="container flex flex-row-reverse justify-evenly items-baseline mt-8  ">
     
     <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
       <Button type="button" onClick={handleUpdateLeadStages} className="mb-4 flex justify-center">
        Update Leads
      </Button>
      </div>
     
      
     
      
    </div>
  );
}

export default LeadWindow;
