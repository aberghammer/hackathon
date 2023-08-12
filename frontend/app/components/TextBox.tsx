// TextBoxComponent.jsx
import React from 'react';

type TextBoxProps = {
    value: string;
    onChange: (newVal: string) => void;
};

const TextBoxComponent: React.FC<TextBoxProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <textarea
            value={value}
            onChange={handleChange}
            className="w-full h-full shadow-md bg-white p-4 rounded-lg"
            placeholder="Enter your text here..."
        />
    );
}

export default TextBoxComponent;
