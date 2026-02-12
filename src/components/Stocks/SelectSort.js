import React from "react";

function SelectSort() {
  return (
    <div>
      <details className="custom-select"  title="Sort...">
        <summary className="radios">
          <input
            type="radio"
            name="item"
            id="default"
            title="Sort..."
            // checked
          />
          <input type="radio" name="item" id="item1" title="1D" />
          <input type="radio" name="item" id="item2" title="1M" />
          <input type="radio" name="item" id="item3" title="1Y" />
          <input type="radio" name="item" id="item4" title="3Y" />
          <input type="radio" name="item" id="item5" title="5Y" />
        </summary>
        <ul className="list">
          <li>
            <label htmlFor="item1">
              1D
              <span></span>
            </label>
          </li>
          <li>
            <label htmlFor="item2">1M</label>
          </li>
          <li>
            <label htmlFor="item3">1Y</label>
          </li>
          <li>
            <label htmlFor="item4">3Y</label>
          </li>
          <li>
            <label htmlFor="item5">5Y</label>
          </li>
        </ul>
      </details>
    </div>
  );
}

export default SelectSort;
