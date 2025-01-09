import React from 'react';

const ColorPicker: React.FC<{ onChange: (color: string) => void }> = ({ onChange }) => {
    return (
        <input
            type="color"
            onChange={(e) => onChange(e.target.value)}
            className="border rounded"
        />
    );
};

export default ColorPicker;