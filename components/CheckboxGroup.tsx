
import React from 'react';
import type { QuestionType } from '../types';

interface CheckboxGroupProps {
  label: string;
  options: readonly QuestionType[];
  selectedOptions: QuestionType[];
  onChange: (value: QuestionType) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedOptions, onChange }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
        {options.map(option => (
          <div key={option} className="flex items-center">
            <input
              id={option}
              type="checkbox"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => onChange(option)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <label htmlFor={option} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
