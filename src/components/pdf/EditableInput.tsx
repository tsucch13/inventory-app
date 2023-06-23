import React, { FC, useState } from "react";
import { Text } from "@react-pdf/renderer";
import compose from "@/styles/compose";

interface Props {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  pdfMode?: boolean;
  suggestions?: string[]; // Add suggestions prop
}

const EditableInput: FC<Props> = ({
  className,
  placeholder,
  value,
  onChange,
  pdfMode,
  suggestions = [], // Set default value for suggestions prop
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (inputValue: string) => {
    if (onChange) {
      onChange(inputValue);
    }

    // Filter the suggestions based on the input value
    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (onChange) {
      onChange(suggestion);
    }
  };

  return (
    <>
      {pdfMode ? (
        <Text style={compose("span " + (className ? className : ""))}>
          {value}
        </Text>
      ) : (
        <>
          <input
            type="text"
            className={"input " + (className ? className : "")}
            placeholder={placeholder || ""}
            value={value || ""}
            onChange={(e) => handleInputChange(e.target.value)} // Call handleInputChange on input change
            list="suggestion-list"
          />
          <datalist id="suggestion-list">
            {filteredSuggestions.map((suggestion, index) => (
              <option
                key={index}
                value={suggestion}
                onClick={() => handleSuggestionClick(suggestion)} // Call handleSuggestionClick on suggestion click
              />
            ))}
          </datalist>
        </>
      )}
    </>
  );
};

export default EditableInput;
