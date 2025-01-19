// components/DateRangePicker.js
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Default theme CSS
import format from "date-fns/format";

const CustomDateRangePicker = () => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [inputValue, setInputValue] = useState(
    `From ${format(range[0].startDate, "do MMM yyyy")} to ${format(
      range[0].endDate,
      "do MMM yyyy"
    )}`
  );

  const handleChange = (item) => {
    setRange([item.selection]);
    setInputValue(
      `From ${format(item.selection.startDate, "do MMM yyyy")} to ${format(
        item.selection.endDate,
        "do MMM yyyy"
      )}`
    );
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <input
        value={inputValue}
        readOnly
        onClick={() =>
          document.getElementById("picker").classList.toggle("show")
        }
        style={{
          padding: "10px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <div
        id="picker"
        style={{
          position: "absolute",
          top: "50px",
          zIndex: 100,
          display: "none",
        }}
        className="date-picker-container"
      >
        <DateRangePicker
          ranges={range}
          onChange={handleChange}
          months={2}
          direction="horizontal"
        />
      </div>
    </div>
  );
};

export default CustomDateRangePicker;
