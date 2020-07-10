import React, { useState, Fragment } from 'react';
import './Dropdown.css';

interface DropdownProps {
  label: string,
  choices: string[],
  setSelected: Function,
  selected: string
};

// https://codepen.io/jakestuts/pen/nEFyw

export const Dropdown: React.FC<DropdownProps> = ({ label, choices, setSelected, selected }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!open);
  }
  const select = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.currentTarget.textContent !== null) {
      console.log('setting location')
      setSelected(e.currentTarget.textContent);
    }
  }
  return (
    <Fragment>
      <div id="dropdown" className={`ddmenu ${open ? "open" : ""}`} onClick={toggleDropdown}>
        {`${selected ? selected : label}`}
        <ul className={`${open ? "open" : ""}`}>
          {
            choices.map((choice: string, i) =>
              <li key={i.toString()} onClick={select} value={choice}>{choice}</li>

            )
          }

        </ul>
      </div>
    </Fragment>
  );
}