import React, { FC, useState } from "react";
import Autocomplete from "react-autocomplete";
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

const EditableTextarea: FC<Props> = ({
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

  const handleSuggestionSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <>
      {pdfMode ? (
        <Text style={compose("span " + (className ? className : ""))}>
          {value}
        </Text>
      ) : (
        <Autocomplete
          items={filteredSuggestions}
          value={value || ""}
          getItemValue={(item) => item}
          onChange={(e) => handleInputChange(e.target.value)}
          onSelect={(value) => handleSuggestionSelect(value)}
          renderInput={(props) => (
            <input
              type="text"
              className={"input " + (className ? className : "")}
              placeholder={placeholder || ""}
              {...props}
            />
          )}
          renderMenu={(items) => <ul className="suggestion-list">{items}</ul>}
          renderItem={(item, isHighlighted) => (
            <li
              key={item}
              style={{ background: isHighlighted ? "lightgray" : "white" }}
            >
              {item}
            </li>
          )}
        />
      )}
    </>
  );
};

export default EditableTextarea;
