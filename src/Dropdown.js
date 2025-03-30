import React, { useState, useEffect } from "react";

const Dropdown = () => {
    const [selectedValues, setSelectedValues] = useState([""]);
    const [displayValues, setDisplayValues] = useState([]);
    const [nakshatramData, setNakshatramData] = useState([]);

    const options = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
        "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
        "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
        "Uttara Bhadrapada", "Revati"
    ];

    useEffect(() => {
        fetch("/data.json")
            .then(response => response.json())
            .then(data => setNakshatramData(data.Nakshatram || []))
            .catch(error => console.error("Error loading JSON:", error));
    }, []);

    const handleChange = (event, index) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = event.target.value;
        setSelectedValues(newSelectedValues);
    };

    const handleSubmit = () => {
        const allNextValues = selectedValues.map(selectedValue => {
            const indexInOptions = options.indexOf(selectedValue);
            if (indexInOptions === -1) return [];

            return [
                options[(indexInOptions + 1) % options.length],
                options[(indexInOptions + 3) % options.length],
                options[(indexInOptions + 5) % options.length],
                options[(indexInOptions + 7) % options.length],
                options[(indexInOptions + 8) % options.length],
                options[(indexInOptions + 10) % options.length],
                options[(indexInOptions + 12) % options.length],
                options[(indexInOptions + 14) % options.length],
                options[(indexInOptions + 16) % options.length],
                options[(indexInOptions + 17) % options.length],
                options[(indexInOptions + 18) % options.length],
                options[(indexInOptions + 21) % options.length],
                options[(indexInOptions + 23) % options.length],
                options[(indexInOptions + 25) % options.length],
                options[(indexInOptions + 26) % options.length]
            ];
        });

        const commonValues = allNextValues.reduce((acc, currentValues) =>
            acc.length === 0 ? currentValues : acc.filter(value => currentValues.includes(value)),
            []);

        setDisplayValues(commonValues);
    };

    const getSchedules = (nakshatramName) => {
        const nakshatram = nakshatramData.find(item => item.name === nakshatramName);
        return nakshatram ? nakshatram.schedules : [];
    };

    const addDropdown = () => {
        setSelectedValues(prev => [...prev, ""]);
    };

    const removeDropdown = () => {
        if (selectedValues.length > 1) {
            setSelectedValues(prev => prev.slice(0, prev.length - 1));
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
           <label style={{ fontSize: "20px", fontWeight: "bold" }}>Nakshatram: </label>

            {selectedValues.map((_, index) => (
                <div key={index} style={{ marginBottom: "10px",marginTop: "15px", textAlign: "center"  }}>
                    <select value={selectedValues[index]} onChange={(e) => handleChange(e, index)}>
                        <option value="">-- Choose --</option>
                        {options.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                        ))}
                    </select>

                    {index === selectedValues.length - 1 && (
                        <>
                            <span
                                onClick={addDropdown}
                                style={{ marginLeft: "10px", cursor: "pointer", fontSize: "20px", color: "blue" }}
                            >
                                +
                            </span>
                            {selectedValues.length > 1 && (
                                <span
                                    onClick={removeDropdown}
                                    style={{ marginLeft: "10px", cursor: "pointer", fontSize: "20px", color: "red" }}
                                >
                                    -
                                </span>
                            )}
                        </>
                    )}
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={selectedValues.includes("")}
                style={{ marginTop: "10px" }}
            >
                Submit
            </button>

            {displayValues.length === 0 && (
                 <div style={{ marginTop: "10px", color: "red", textAlign: "center" }}>
                    <p>No common values found.</p>
                </div>
            )}

            {displayValues.length > 0 && (
                <div style={{ marginTop: "50px" }}>
                    {displayValues.map((value, index) => {
                        const schedules = getSchedules(value);
                        return (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <p><strong>{value}</strong></p>
                                {schedules.length > 0 ? (
                                    schedules.map((schedule, scheduleIndex) => (
                                        <div key={scheduleIndex}>
                                            <p>Date: {schedule.date}</p>
                                            <p>Time: {schedule.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No schedule available for this Nakshatram.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
