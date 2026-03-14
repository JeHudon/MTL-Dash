// src/components/Dropdown.jsx
import React from "react";

function Dropdown({ id, label, options, openDropdown, setOpenDropdown, onSelect }) {
    const isOpen = openDropdown === id;
    
    return (
        <div className={`dropdown ${isOpen ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
                <button
                    className="button custom-select-button"
                    onClick={() => setOpenDropdown(isOpen ? null : id)}
                >
                    <span>{label}</span>
                    <i className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}></i>
                </button>
            </div>
            <div className="dropdown-menu">
                <div className="dropdown-content">
                    {options.map((option) => (
                        <React.Fragment key={option.value}>
                            <a
                                className="dropdown-item"
                                onClick={() => {
                                    onSelect(option.value);
                                    setOpenDropdown(null);
                                }}
                            >
                                {option.label}
                            </a>
                            <hr />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dropdown;
