import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer gap-2">
      <div 
        className={`w-5 h-5 rounded-md flex items-center justify-center outline-none
          ${checked ? 'bg-[#00FFB8]' : 'bg-[#171717]'}`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="black" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </div>
    </label>
  );
};

export default CustomCheckbox;