// TextBoxComponent.jsx
import React, { useRef } from 'react';


type TextBoxProps = {
    value: string;
    onChange: (newVal: string) => void;
};

const TextBoxComponent: React.FC<TextBoxProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };


    const crazySymbol = "¸"

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleCopyToClipboard = () => {
        if (textareaRef.current) {
            navigator.clipboard.writeText(crazySymbol + textareaRef.current.value + crazySymbol)
                .then(() => {
                    // Optionally, you can add logic here to notify the user that copying was successful.
                    console.log("Text copied to clipboard");
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    };

    return (
        <>
            <textarea

                ref={textareaRef}
                value={value}
                onChange={handleChange}
                className="w-full h-full shadow-md bg-white p-4 rounded-lg"
                placeholder="Enter your text here..."
            />
            <button
                onClick={handleCopyToClipboard}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Add to Clipboard
            </button>
        </>

    );
}

export default TextBoxComponent;
