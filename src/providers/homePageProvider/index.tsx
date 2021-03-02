import React, { createContext, useEffect, useState } from 'react';

// types
import type { GetAllBreeds } from '@/services/breeds';

interface MissingDataFields {
  BreedSelect: boolean;
  SubBreedSelect: boolean;
  NumberOfImagesToShowSelect: boolean;
}

interface ContextType {
  breedsMap: GetAllBreeds;
  selectedBreed: string;
  selectedSubBreed?: string;
  numberOfImagesToShow: number;
  pagination: {
    imagesToView: string[];
    totalPageNumber: number;
  };
  missingDataFields: (keyof MissingDataFields)[];
  setSelectedBreed: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSubBreed?: React.Dispatch<React.SetStateAction<string>>;
  setNumberOfImagesToShow: React.Dispatch<React.SetStateAction<number>>;
  setBreedsMap: React.Dispatch<React.SetStateAction<GetAllBreeds>>;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      imagesToView: string[];
      totalPageNumber: number;
    }>
  >;
  setBeforeFetchRandomImages: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Context = createContext<ContextType>({
  breedsMap: {},
  selectedBreed: '',
  numberOfImagesToShow: 0,
  pagination: {
    imagesToView: [],
    totalPageNumber: 0,
  },
  missingDataFields: [],
  setSelectedBreed: () => {},
  setNumberOfImagesToShow: () => {},
  setBreedsMap: () => {},
  setPagination: () => {},
  setBeforeFetchRandomImages: () => {},
});

const ContextProvider: React.FC<unknown> = ({ children }) => {
  const [
    beforeFetchRandomImages,
    setBeforeFetchRandomImages,
  ] = useState<boolean>(false);
  const [missingDataFields, setMissingDataFields] = useState<
    (keyof MissingDataFields)[]
  >([]);
  const [breedsMap, setBreedsMap] = useState<GetAllBreeds>({});
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [selectedSubBreed, setSelectedSubBreed] = useState<string>('');
  const [numberOfImagesToShow, setNumberOfImagesToShow] = useState<number>(0);
  const [pagination, setPagination] = useState<{
    imagesToView: string[];
    totalPageNumber: number;
  }>({
    imagesToView: [],
    totalPageNumber: 0,
  });

  // Filter Fields Validation
  useEffect(() => {
    if (beforeFetchRandomImages) {
      const _missingDataFields: (keyof MissingDataFields)[] = [];
      if (
        breedsMap &&
        selectedBreed &&
        breedsMap[selectedBreed] &&
        !selectedSubBreed
      ) {
        _missingDataFields.push('SubBreedSelect');
      }
      if (!selectedBreed) {
        _missingDataFields.push('BreedSelect');
      }
      if (!numberOfImagesToShow) {
        _missingDataFields.push('NumberOfImagesToShowSelect');
      }

      if (_missingDataFields.length) {
        setMissingDataFields([..._missingDataFields]);
      }
    }

    return () => setBeforeFetchRandomImages(false);
  }, [beforeFetchRandomImages]);

  // Remove error after user has input value into fields
  useEffect(() => {
    if (missingDataFields.includes('BreedSelect') && selectedBreed) {
      setMissingDataFields(
        missingDataFields.filter((field) => field !== 'BreedSelect')
      );
    }
    if (missingDataFields.includes('SubBreedSelect') && selectedSubBreed) {
      setMissingDataFields(
        missingDataFields.filter((field) => field !== 'SubBreedSelect')
      );
    }
    if (
      missingDataFields.includes('NumberOfImagesToShowSelect') &&
      numberOfImagesToShow
    ) {
      setMissingDataFields(
        missingDataFields.filter(
          (field) => field !== 'NumberOfImagesToShowSelect'
        )
      );
    }
  }, [
    selectedBreed,
    selectedSubBreed,
    numberOfImagesToShow,
    missingDataFields,
  ]);

  return (
    <Context.Provider
      value={{
        breedsMap,
        selectedBreed,
        selectedSubBreed,
        numberOfImagesToShow,
        pagination,
        missingDataFields,
        setSelectedBreed,
        setSelectedSubBreed,
        setNumberOfImagesToShow,
        setBreedsMap,
        setPagination,
        setBeforeFetchRandomImages,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
