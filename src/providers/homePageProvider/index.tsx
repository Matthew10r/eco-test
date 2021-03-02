import React, { createContext, useState } from 'react';

// types
import type { GetAllBreeds } from '@/services/breeds';

interface ContextType {
  breedsMap: GetAllBreeds;
  selectedBreed: string;
  selectedSubBreed?: string;
  numberOfImagesToShow: number;
  setSelectedBreed: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSubBreed?: React.Dispatch<React.SetStateAction<string>>;
  setNumberOfImagesToShow: React.Dispatch<React.SetStateAction<number>>;
  setBreedsMap: React.Dispatch<React.SetStateAction<GetAllBreeds>>;
}

export const Context = createContext<ContextType>({
  breedsMap: {},
  selectedBreed: '',
  numberOfImagesToShow: 0,
  setSelectedBreed: () => {},
  setNumberOfImagesToShow: () => {},
  setBreedsMap: () => {},
});

const ContextProvider: React.FC<unknown> = ({ children }) => {
  const [breedsMap, setBreedsMap] = useState<GetAllBreeds>({});
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [selectedSubBreed, setSelectedSubBreed] = useState<string>('');
  const [numberOfImagesToShow, setNumberOfImagesToShow] = useState<number>(0);

  return (
    <Context.Provider
      value={{
        breedsMap,
        selectedBreed,
        selectedSubBreed,
        numberOfImagesToShow,
        setSelectedBreed,
        setSelectedSubBreed,
        setNumberOfImagesToShow,
        setBreedsMap,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
