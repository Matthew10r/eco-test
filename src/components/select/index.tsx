import React, { useState, useEffect } from 'react';

interface Props {
  onClick: (target: string | number) => void;
  selectedOption: string;
  label: string;
  options: string[] | number[] | undefined;
}

const Select: React.FC<Props> = ({
  label,
  options,
  selectedOption,
  onClick,
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [onHoverOption, setOnHoverOption] = useState<string | number | null>();
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (options?.length) {
      setDisabled(false);
    }
  }, [options]);

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-1 relative">
        <button
          onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          disabled={disabled}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 min-h-selectBox"
        >
          <span className="flex items-center">
            <span className="block truncate">{selectedOption}</span>
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        <div
          className={`transition ease-in duration-100 ${
            isOpenDropdown ? 'opacity-100' : 'opacity-0'
          } absolute mt-1 w-full rounded-md bg-white shadow-lg`}
        >
          {isOpenDropdown && (
            <ul
              tabIndex={-1}
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-item-3"
              className="max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {(options as string[] | number[]).map(
                (option: string | number) => (
                  <li
                    role="option"
                    aria-selected={option === selectedOption}
                    onClick={() => {
                      onClick(option);
                      setIsOpenDropdown(false);
                    }}
                    onMouseEnter={() => setOnHoverOption(option)}
                    onMouseLeave={() => setOnHoverOption(null)}
                    className={`text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 ${
                      option === onHoverOption ? 'bg-green-500' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="block font-normal truncate">
                        {option}
                      </span>
                    </div>
                    {option === selectedOption && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;
