// import React, { useState } from "react";
// import "react-dates/initialize";
// import { DateRangePicker } from "react-dates";
// import "react-dates/lib/css/_datepicker.css";

// function DatePicker() {
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [focusedInput, setFocusedInput] = useState(null);
//   const handleDatesChange = ({ startDate, endDate }) => {
//     setStartDate(startDate);
//     setEndDate(endDate);
//   };
//   return (
//     <div className="App">
//       <DateRangePicker
//         startDate={startDate}
//          startDateId="tata-start-date"
//         endDate={endDate}
//          endDateId="tata-end-date"
//         onDatesChange={handleDatesChange}
//         focusedInput={focusedInput}
//          onFocusChange={focusedInput => setFocusedInput(focusedInput)}
//       />
//     </div>
//   );
// }

// export default DatePicker;


import React, { useReducer } from "react";
import { DateRangeInput } from "@datepicker-react/styled";
import { ThemeProvider } from "styled-components";

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null
};

function reducer(state, action) {
  switch (action.type) {
    case "focusChange":
      return { ...state, focusedInput: action.payload };
    case "dateChange":
      return action.payload;
    default:
      throw new Error();
  }
}






const DatePicker=()=> {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log('startdateeeeee',initialState.startDate);
  console.log('enddateeeeeeee',initialState.endDate);
  
  
  
  
  return (
    
    <ThemeProvider
      theme={{
        breakpoints: ["32em", "48em", "64em"],
        reactDatepicker: {
          daySize: [36, 40],
          fontFamily: "system-ui, -apple-system",
          colors: {
            accessibility: "#D80249",
            selectedDay: "#f7518b",
            selectedDayHover: "#F75D95",
            primaryColor: "#d8366f"
          }
        }
      }}
    >
      <DateRangeInput 
      
        onDatesChange={data => dispatch({ type: "dateChange", payload: data })}
        onFocusChange={focusedInput =>
          dispatch({ type: "focusChange", payload: focusedInput })
        }
       
        startDate={state.startDate} // Date or null
        endDate={state.endDate} // Date or null
        focusedInput={state.focusedInput} // START_DATE, END_DATE or null
      />
    </ThemeProvider>

  
  );

}
export default DatePicker;

