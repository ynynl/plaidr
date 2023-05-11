import React, { useState } from "react";
import './styles.css';

const PreviewSizeInput = ({ plaidWidth, plaidHeight, setPlaidWidth, setPlaidHeight }) => {
    const [newPlaidWidth, setNewPlaidWidth] = useState(plaidWidth);
    const [newPlaidHeight, setNewPlaidHeight] = useState(plaidHeight);
    const handleSubmit = (e) => {
        e.preventDefault();
        setPlaidWidth(newPlaidWidth);
        setPlaidHeight(newPlaidHeight);
    };

    const handleWidthChange = (e) => {
        const value = e.target.value;
        if (value === "" || value === null) {
            setNewPlaidWidth(null);
        } else {
            setNewPlaidWidth(Number(value));
        }
    };

    const handleHeightChange = (e) => {
        const value = e.target.value;
        if (value === "" || value === null) {
            setNewPlaidHeight(null);
        } else {
            setNewPlaidHeight(Number(value));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="widthInput" className="input-label">Width:</label>
                    <input
                        id="widthInput"
                        type="number"
                        value={newPlaidWidth === null ? "" : newPlaidWidth}
                        onChange={handleWidthChange}
                        className="input-field"
                    />
                    <label htmlFor="heightInput" className="input-label">Height:</label>
                    <input
                        id="heightInput"
                        type="number"
                        value={newPlaidHeight === null ? "" : newPlaidHeight}
                        onChange={handleHeightChange}
                        className="input-field"
                    />
                    <button type="submit" className="btn btn--primary">✂️</button>
                </div>
            </form>
        </div>
    );
}

export default PreviewSizeInput