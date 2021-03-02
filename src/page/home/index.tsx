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
  const { setBreedsMap, selectedBreed, setSelectedBreed } = useContext(
    HomePageContext
  );
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
      onClick={(target) => setNumberOfImagesToShow(target as number)}
      selectedOption={numberOfImagesToShow}
      label="Number of Images"
      options={options}
    />
  );
};

const HomePage: React.FC<unknown> = () => {
  console.log('This is Home Page!');
  return (
    <HomePageContextProvider>
      <div className="grid grid-flow-col grid-cols-4 grid-rows-1 gap-4">
        <BreedSelect />
        <SubBreedSelect />
        <NumberOfImagesToShowSelect />
      </div>
    </HomePageContextProvider>
  );
};

export default HomePage;
