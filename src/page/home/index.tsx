import React, { useEffect, useState, useContext } from 'react';

// Services
import { getAllBreeds, getBreedDetails } from '@/services/breeds';

// Components
import Select from '@/components/select';

// Context Provider
import HomePageContextProvider, {
  Context as HomePageContext,
} from '@/providers/homePageProvider';

const BreedSelect: React.FC<unknown> = () => {
  const {
    setBreedsMap,
    selectedBreed,
    setSelectedBreed,
    missingDataFields,
  } = useContext(HomePageContext);
  const [options, setOptions] = useState<string[]>();
  useEffect(() => {
    (async () => {
      const { data } = await getAllBreeds();
      if (data && data.status === 'success') {
        setBreedsMap(data.message);
        setOptions(Object.keys(data.message));
      }
    })();
  }, []);

  return (
    <Select
      className={
        missingDataFields.includes('BreedSelect') ? 'border-red-700' : ''
      }
      onClick={(target) => setSelectedBreed(target as string)}
      selectedOption={selectedBreed}
      label="Breed"
      options={options}
    />
  );
};

const SubBreedSelect: React.FC<unknown> = () => {
  const {
    breedsMap,
    selectedSubBreed,
    selectedBreed,
    setSelectedSubBreed,
    missingDataFields,
  } = useContext(HomePageContext);
  const [options, setOptions] = useState<string[]>();

  useEffect(() => {
    if (selectedBreed && breedsMap) {
      if (breedsMap?.[selectedBreed].length) {
        setOptions(breedsMap?.[selectedBreed]);
      }
    }

    return () => {
      setOptions([]);

      if (setSelectedSubBreed) {
        setSelectedSubBreed('');
      }
    };
  }, [selectedBreed, breedsMap]);

  return (
    <Select
      className={
        missingDataFields.includes('SubBreedSelect') ? 'border-red-700' : ''
      }
      onClick={(target) =>
        setSelectedSubBreed && setSelectedSubBreed(target as string)
      }
      selectedOption={selectedSubBreed || ''}
      label="Sub Breed"
      options={options}
    />
  );
};

const NumberOfImagesToShowSelect: React.FC<unknown> = () => {
  const {
    breedsMap,
    selectedBreed,
    selectedSubBreed,
    setNumberOfImagesToShow,
    numberOfImagesToShow,
    missingDataFields,
  } = useContext(HomePageContext);
  const [options, setOptions] = useState<number[]>();

  useEffect(() => {
    (async () => {
      let result;
      if (selectedBreed && selectedSubBreed) {
        result = await getBreedDetails({ selectedBreed, selectedSubBreed });
        setOptions(Array.from(Array(result.data.message.length).keys()));
        return;
      }
      if (breedsMap && selectedBreed && !breedsMap[selectedBreed].length) {
        result = await getBreedDetails({ selectedBreed });
        setOptions(Array.from(Array(result.data.message.length).keys()));
      }
    })();
  }, [selectedBreed, selectedSubBreed]);

  return (
    <Select
      className={
        missingDataFields.includes('NumberOfImagesToShowSelect')
          ? 'border-red-700'
          : ''
      }
      onClick={(target) => setNumberOfImagesToShow(target as number)}
      selectedOption={numberOfImagesToShow}
      label="Number of Images"
      options={options}
    />
  );
};

const ViewImagesBtn: React.FC<unknown> = () => {
  const { setBeforeFetchRandomImages } = useContext(HomePageContext);
  return (
    <button
      onClick={() => setBeforeFetchRandomImages(true)}
      className="inline-flex justify-center py-2 px-4 border border-transparent text-lg items-center shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      View Image
    </button>
  );
};

const HomePage: React.FC<unknown> = () => (
  <HomePageContextProvider>
    <div className="grid grid-flow-col grid-cols-4 grid-rows-1 gap-4">
      <BreedSelect />
      <SubBreedSelect />
      <NumberOfImagesToShowSelect />
      <ViewImagesBtn />
    </div>
  </HomePageContextProvider>
);

export default HomePage;
