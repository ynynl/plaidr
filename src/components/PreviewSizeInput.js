import React, {useState} from "react";
import './PreviewSizeInput.css';

const PreviewSizeInput = ({ plaidWidth, plaidHeight, setPlaidWidth, setPlaidHeight }) => {
    const [newPlaidWidth, setNewPlaidWidth] = useState(plaidWidth);
    const [newPlaidHeight, setNewPlaidHeight] = useState(plaidHeight); 
    const handleSubmit = () => {
        setPlaidWidth(newPlaidWidth);
        setPlaidHeight(newPlaidHeight);
    };


    return (
        <div>
<div className="input-container">
  <label htmlFor="widthInput" className="input-label">Width:</label>
  <input
    id="widthInput"
    type="number"
    value={newPlaidWidth}
    onChange={(e) => setNewPlaidWidth(Number(e.target.value))}
    className="input-field"
  />
</div>

<div className="input-container">
  <label htmlFor="heightInput" className="input-label">Height:</label>
  <input
    id="heightInput"
    type="number"
    value={newPlaidHeight}
    onChange={(e) => setNewPlaidHeight(Number(e.target.value))}
    className="input-field"
  />
</div>

<button onClick={() => handleSubmit()} className="submit-button">Submit</button>
        </div>
    );
}

export default PreviewSizeInput