import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function LeadWindow() {
  const [leads, setLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    Array(leads.length).fill(null)
  );

  const [selectedLeadIndex, setSelectedLeadIndex] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarOpenIndex, setCalendarOpenIndex] = useState(null);
  const [inputFieldValues, setInputFieldValues] = useState(Array(leads.length).fill(null));

  const [remarks, setRemarks] = useState(Array(leads.length).fill(''));




  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    // Initialize selectedDate based on leads data
    setSelectedDate(leads.map(() => null));

    setInputFieldValues(leads.map(() => null));
  }, [leads]);

  // useEffect(() => {
  //   // Initialize ref array based on leads data
  //   inputRefs.current = leads.map(() => useRef(null));
  // }, [leads]);

  // useEffect(() => {
  //   // Initialize selectedDate based on leads data
  //   if (leads.length > 0) {
  //     // Only set the state if there are leads
  //     setSelectedDate((prevSelectedDate) => {
  //       // Ensure that the length of selectedDate matches the length of leads
  //       const newSelectedDate = [...prevSelectedDate];
  //       while (newSelectedDate.length < leads.length) {
  //         newSelectedDate.push(null);
  //       }
  //       return newSelectedDate;
  //     });
  //   }
  // }, [leads]);
  


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

        const datesFromLeads =  result.leads.map((lead) => (lead.formatted_last_updated  ? new Date(lead.formatted_last_updated) : null));

        console.log("front end lead dates:" ,datesFromLeads)

        setSelectedDate(datesFromLeads);

        const remarksFromLeads = result.leads.map((lead) => lead.Remarks || '');
       
       
        // setRemarks(remarksFromLeads);

        setRemarks(leadsWithSerialNumber.map((lead) => lead.remarks));

        console.log("Leads with serial numbers:", leadsWithSerialNumber);
      } else {
        console.error("Error fetching leads:", result.message);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleLeadStageChange = (index, selectedLeadStage) => {
    // Update the leadStage value for the specific lead
    setLeads((prevLeads) =>
      prevLeads.map((lead, i) =>
        i === index ? { ...lead, selectedLeadStage: selectedLeadStage } : lead
      )
    );
  };

  const handleRemarksChange = (value, index) => {
    setRemarks((prevRemarks) => {
      const newRemarks = [...prevRemarks];
      newRemarks[index] = value;
      return newRemarks;
    });
    console.log("new remarks are:",remarks)
  };

  const formatDate = (date) => {
    if (!date) return null;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateChange = (date, index) => {
    console.log("Incoming date:", date);
    console.log("Before Update - selectedDate:", selectedDate);
    // ... rest of the code

    console.log("Type of selectedDate[index]:", typeof selectedDate[index]);
    console.log("Value of selectedDate[index]:", selectedDate[index]);

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
      newDates[index] = date;
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
          selectedLeadStage: lead.selectedLeadStage,
          // date: formatDate(selectedDateValue),
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

            remarks: lead.remarks
          }))
        );

        
        // setSelectedDate(updatedLeads.map((lead) => new Date(lead.date)));
        // setSelectedDate(result.updatedLeads.map((lead) => new Date(lead.date)));
      
      
        // setSelectedDate(
        //   result.updatedLeads.map((lead) =>
        //     lead.date ? new Date(lead.date) : null
        //   )
        // );

     

      //   updatedLeads.forEach((lead, leadIndex) => {
      //     const inputField = document.getElementById(`dateInput-${leadIndex}`);
      //     if (inputField) {
      //       inputField.value = lead.date;
      //        setSelectedDate((prevSelectedDate) => {
      //   const updatedSelectedDate = [...prevSelectedDate];
      //   updatedSelectedDate[leadIndex] = new Date(lead.date);
      //   return updatedSelectedDate;
      // });
      //     }
      //   });
     
      // updatedLeads.forEach((lead, leadIndex) => {
      //   const inputField = document.getElementById(`dateInput-${leadIndex}`);
      //   if (inputField) {
      //     inputField.value = lead.date
      //     ? lead.date.toLocaleDateString()
      //     : "No date Available";
      //   }

      //   setSelectedDate([...selectedDate]);

      //   selectedDate[leadIndex] = lead.date ? new Date(lead.date) : null;
      // });

      


      setSelectedDate(result.updatedLeads.map((lead) => new Date(lead.date)));
      

      console.log("After Update - selectedDate:", selectedDate);
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
  

  return (
    <div>
      <h1 className="mt-32">Leads Window</h1>
      {/* <h2 className='flex justify-center'>Leads</h2> */}
      <table className="ml-96">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Sr.No.</th>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Existing Status</th>
            {/* <th>Current Status</th> */}
            <th>Next Follow up</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {leads?.map((lead, index) => (
            <tr key={lead.serialNumber ?? index}>
              {/* <td>{lead.id}</td> */}
              <td>{lead.serialNumber}</td>
              <td>{lead["Name"]}</td>
              <td>{lead["Mobile Number"]}</td>
              <td>{lead.Email}</td>

              <td>
                {/* Dropdown for Lead Stage */}
                <select
                  value={lead.selectedLeadStage}
                  onChange={(e) => handleLeadStageChange(index, e.target.value)}
                >
                  <option value="Fresh">Fresh</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Not Able to Connect">
                    Not Able to Connect
                  </option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </td>

              <td style={{ position: "relative" }}>
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

              <td>
                <textarea
                  value={remarks[index]}
                  //onChange={(e) => handleRemarksChange(e, index)}
                  onChange={(e) => handleRemarksChange(e.target.value, index)}
                  rows="3"
                  cols="30"
                  maxLength="255"
                 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button"  onClick={handleUpdateLeadStages}>Update Lead Stages</button>
    </div>
  );
}

export default LeadWindow;
