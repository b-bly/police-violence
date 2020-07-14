import React from "react";
import './Dropdown.css';

interface DropdownProps {
  listRef: React.RefObject<HTMLUListElement>,
  label: string,
  choices: string[],
  setSelected: Function,
  selected: string,
  dropdownOpen: string,
  setDropdownOpen: Function,
  height: number
};



export const Dropdown: React.FC<DropdownProps> = ({ listRef, label, choices, 
  setSelected, selected, dropdownOpen, setDropdownOpen, height }) => {
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (dropdownOpen === label) {
      setDropdownOpen("");
      return;
    }
    setDropdownOpen(label);
  }

  const select = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.currentTarget.textContent !== null
      && e.currentTarget.textContent !== selected) {
        console.log('set selected')
      setSelected(e.currentTarget.textContent);
    }
  }

  return (
    <div className="dropdown-container">
      <label className="label">{label}</label>
      <div
        id="dropdown"
        className={`ddmenu ${dropdownOpen ? "open" : ""}`}
        onClick={toggleDropdown}>
        {`${selected ? selected : label}`}
        <ul
          className={`${dropdownOpen === label ? "open" : ""}`}
          ref={listRef}
          style={{ maxHeight: `${height.toString()}px`}}
        >
          {
            choices.map((choice: string, i) =>
              <li key={i.toString()} onClick={select} value={choice} className={label}>{choice}</li>
            )
          }
        </ul>
      </div>
    </div>
  );
}