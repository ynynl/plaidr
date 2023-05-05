
import React from 'react';
import { getRandomItems, randomPivots } from '../utils';

export const ColorPicker = ({ rgbArray, numOfColor, setColors, setPivots, setNumOfColor }) => {
    const handleNumOfColorChange = (event) => {
        const newNumOfColor = event.target.value;
        setNumOfColor(newNumOfColor);
        const newColors = getRandomItems(rgbArray, newNumOfColor);
        const newPivots = randomPivots(newNumOfColor - 1);
        setColors(newColors);
        setPivots(newPivots);
    };

    const handleNewColor = () => {
        setColors(getRandomItems(rgbArray, numOfColor));
    };

    const handleNewPivots = () => {
        setPivots(randomPivots(numOfColor - 1));
    };

    return (
        <div>
            <label htmlFor="numOfColor">Number of Colors:</label>
            <input
                type="range"
                id="numOfColor"
                name="numOfColor"
                min="3"
                max="20"
                value={numOfColor}
                onChange={handleNumOfColorChange}
            />
            <div>
                <button onClick={handleNewPivots}>Generate New Pivots</button>
            </div>
            <div>
                <button onClick={handleNewColor}>Generate New Colors</button>
            </div>
        </div>
    );
};

export const TwillPicker = ({ twill, setTwill }) => {
    const handleTwillChange = (event) => {
        setTwill(event.target.value);
    };

    return (
        <div>
            <label htmlFor="twill">Twill:</label>
            <input
                type="radio"
                id="tartan"
                name="twill"
                value="tartan"
                checked={twill === "tartan"}
                onChange={handleTwillChange}
            />
            <label htmlFor="tartan">Tartan</label>
            <input
                type="radio"
                id="net"
                name="twill"
                value="net"
                checked={twill === "net"}
                onChange={handleTwillChange}
            />
            <label htmlFor="net">Net</label>
            <input
                type="radio"
                id="madras"
                name="twill"
                value="madras"
                checked={twill === "madras"}
                onChange={handleTwillChange}
            />
            <label htmlFor="madras">Madras</label>
        </div>
    );
};

export const SizePicker = ({ size, setSize }) => {
    const handleSizeChange = (event) => {
        setSize(Number(event.target.value));
    };

    return (
        <div>
            <label htmlFor="size">Size:</label>
            <input
                type="range"
                id="size"
                name="size"
                min={64}
                max={512}
                step={64}
                value={size}
                onChange={handleSizeChange}
            />
            <p>Current size: {size}</p>
        </div>
    );
};
