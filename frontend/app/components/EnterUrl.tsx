type URLInputProps = {
    value: string;
    onChange: (newVal: string) => void;
}

const EnterUrl: React.FC<URLInputProps> = ({ value, onChange }) => {
    const isValidURL = (url: string) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(url);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        if (isValidURL(newVal) || newVal === "") { // Allow empty string for initial input
            onChange(newVal);
        }
    }

    return (
        <input
            className="w-full h-full p-4 rounded-lg text-black"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Enter URL"
        />
    );
}

export default EnterUrl;

