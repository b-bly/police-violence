import React, { useState } from 'react';
import './Dropdown.css';

interface DropdownProps {
  label: string,
  choices: string[],
  setSelected: Function,
  selected: string,
  dropdownOpen: string,
  setDropdownOpen: Function
};

// https://codepen.io/jakestuts/pen/nEFyw

export const Dropdown: React.FC<DropdownProps> = ({ label, choices, setSelected, selected, dropdownOpen, setDropdownOpen }) => {
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(dropdownOpen === label ? '' : label);
  }

  const select = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.currentTarget.textContent !== null
      && e.currentTarget.textContent !== selected) {
      setSelected(e.currentTarget.textContent);
    }
  }

  const close = (e: React.FocusEvent) => {
    e.preventDefault();
    console.log('onblur')
    setDropdownOpen('');
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div
        id="dropdown"
        className={`ddmenu ${dropdownOpen ? "open" : ""}`}
        onBlur={close}
        onClick={toggleDropdown}>
        {`${selected ? selected : label}`}
        <ul className={`${dropdownOpen === label ? "open" : ""}`}>
          {
            choices.map((choice: string, i) =>
              <li key={i.toString()} onClick={select} value={choice}>{choice}</li>

            )
          }

        </ul>
      </div>
    </div>
  );
}