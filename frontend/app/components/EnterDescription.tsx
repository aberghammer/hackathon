type DescriptionInputProps = {
    value: string;
    onChange: (newVal: string) => void;
}

export const EnterDescription: React.FC<DescriptionInputProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        if (newVal.length <= 200) {
            onChange(newVal);
        }
    }

    return (
        <textarea
            value={value}
            className="p-4 w-full h-full rounded-lg text-black"
            onChange={handleChange}
            placeholder="Enter description (max 200 characters)"
            maxLength={200}
        />
    );
}
