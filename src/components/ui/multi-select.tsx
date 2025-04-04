// components/ui/multi-select.tsx
"use client";

import React from "react";
import Select from "react-select";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar",
  isDisabled = false,
}: MultiSelectProps) {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      classNames={{
        control: (state) =>
          `border rounded px-1 py-1 ${
            state.isFocused ? "border-blue-500 shadow-sm" : "border-gray-300"
          }`,
        multiValue: () => "bg-blue-100 rounded-md m-1",
        multiValueLabel: () => "text-blue-800 px-2 py-1",
        multiValueRemove: () => "text-blue-500 hover:text-blue-800 px-1 hover:bg-blue-200 rounded-tr-md rounded-br-md",
      }}
    />
  );
}