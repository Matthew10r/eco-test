import React, { useEffect, useState, useContext } from 'react';

// Services
import { getAllBreeds } from '@/services/breeds';

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

const HomePage: React.FC<unknown> = () => {
  console.log('This is Home Page!');
  return (
    <HomePageContextProvider>
      <div className="grid grid-flow-col grid-cols-3 grid-rows-1">
        <BreedSelect />
      </div>
    </HomePageContextProvider>
  );
};

export default HomePage;
