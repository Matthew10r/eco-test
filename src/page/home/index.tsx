import React, { useEffect, useState, useContext } from 'react';
import debounce from 'lodash/debounce';

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
    setSelectedSubBreed,
    missingDataFields,
    setNumberOfImagesToShow,
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

    // Clear all selected values when component unmount!
    return () => {
      setSelectedBreed('');
      if (setSelectedSubBreed) {
        setSelectedSubBreed('');
      }
      setNumberOfImagesToShow(0);
    };
  }, []);

  // reset all other filter when the selected breed filter change ( This is the main filter! )
  useEffect(() => {
    if (setSelectedSubBreed) {
      setSelectedSubBreed('');
    }
    setNumberOfImagesToShow(0);
  }, [selectedBreed]);

  return (
    <Select
      className={
        missingDataFields.includes('BreedSelect') ? 'border-red-500' : ''
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
        missingDataFields.includes('SubBreedSelect') ? 'border-red-500' : ''
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
    selectedBreed,
    selectedSubBreed,
    setSelectedSubBreed,
    setNumberOfImagesToShow,
    numberOfImagesToShow,
    missingDataFields,
  } = useContext(HomePageContext);
  const [options, setOptions] = useState<number[]>();

  // Only the Master Category
  useEffect(() => {
    (async () => {
      if (selectedBreed) {
        const result = await getBreedDetails({ selectedBreed });
        setOptions(Array.from(Array(result.data.message.length).keys()));
      }
    })();

    return () => {
      setNumberOfImagesToShow(0);
      if (selectedSubBreed && setSelectedSubBreed) {
        setSelectedSubBreed('');
      }
    };
  }, [selectedBreed]);

  // With main and sub Category
  useEffect(() => {
    (async () => {
      if (selectedBreed && selectedSubBreed) {
        const result = await getBreedDetails({
          selectedBreed,
          selectedSubBreed,
        });
        setOptions(Array.from(Array(result.data.message.length).keys()));
      }
    })();

    return () => {
      setNumberOfImagesToShow(0);
      if (selectedSubBreed && setSelectedSubBreed) {
        setSelectedSubBreed('');
      }
    };
  }, [selectedSubBreed]);

  return (
    <Select
      className={
        missingDataFields.includes('NumberOfImagesToShowSelect')
          ? 'border-red-500'
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
  const {
    setBeforeFetchRandomImages,
    setPagination,
    validated,
    breedsMap,
    selectedBreed,
    selectedSubBreed,
    numberOfImagesToShow,
  } = useContext(HomePageContext);

  useEffect(() => {
    (async () => {
      if (validated && numberOfImagesToShow !== 0) {
        if (selectedBreed && selectedSubBreed) {
          const { data } = await getBreedDetails({
            type: 'random',
            imagesToShow: numberOfImagesToShow,
            selectedBreed,
            selectedSubBreed,
          });
          setPagination({
            // 20 is the size of the batch
            totalPageNumber: Math.ceil(data.message.length / 10),
            src: data.message,
            imagesToView: [],
            currentPage: data.message.length ? 1 : 0,
          });
        } else if (
          breedsMap &&
          selectedBreed &&
          !breedsMap[selectedBreed].length
        ) {
          const { data } = await getBreedDetails({
            type: 'random',
            imagesToShow: numberOfImagesToShow,
            selectedBreed,
          });
          setPagination({
            // 20 is the size of the batch
            totalPageNumber: Math.ceil(data.message.length / 10),
            src: data.message,
            imagesToView: [],
            currentPage: data.message.length ? 1 : 0,
          });
        }
      }
    })();
  }, [validated]);

  return (
    <button
      onClick={() => setBeforeFetchRandomImages(true)}
      className="inline-flex justify-center py-2 px-4 border border-transparent text-lg items-center shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      View Image
    </button>
  );
};

const ShowImages: React.FC<unknown> = () => {
  const {
    pagination,
    setPagination,
    selectedSubBreed,
    selectedBreed,
  } = useContext(HomePageContext);
  const [trackBatch, setTrackBatch] = useState<{ [key: number]: string[] }>();
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const callback = () => {
      const body = document.querySelector('body');
      if (body && body.getBoundingClientRect().bottom <= window.innerHeight) {
        setIsLoadMore(true);
      }
    };
    window.addEventListener('scroll', debounce(callback, 500));

    return () => window.removeEventListener('scroll', callback);
  }, []);

  useEffect(() => {
    if (isLoadMore) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
    return () => setIsLoadMore(false);
  }, [isLoadMore]);

  useEffect(() => {
    const body = document.querySelector('body');
    console.log(body?.getBoundingClientRect().bottom);
  }, []);

  useEffect(() => {
    if (pagination.src.length) {
      const prevPosition =
        pagination.currentPage === 1 ? 0 : pagination.currentPage * 10;
      const nextPosition =
        pagination.currentPage === 1 ? 10 : pagination.currentPage * 10 + 10;

      const incomingBatch = pagination.src.slice(prevPosition, nextPosition);

      setTrackBatch((prev) => ({
        ...prev,
        [pagination.currentPage]: [...incomingBatch],
      }));
    }
  }, [pagination]);

  // reset when any of those filters changes
  useEffect(() => () => setTrackBatch({}), [
    selectedBreed,
    selectedSubBreed,
    NumberOfImagesToShowSelect,
  ]);

  // DEBUG
  useEffect(() => {
    console.log('pagination', pagination);
  }, [pagination]);

  useEffect(() => {
    console.log('trackBatch', trackBatch);
  }, [trackBatch]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {trackBatch?.[pagination.currentPage]?.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`batch-${pagination.currentPage}-${index}`}
        />
      ))}
    </div>
  );
};

const HomePage: React.FC<unknown> = () => (
  <HomePageContextProvider>
    <div className="grid grid-flow-col grid-cols-4 grid-rows-1 gap-4 mb-5">
      <BreedSelect />
      <SubBreedSelect />
      <NumberOfImagesToShowSelect />
      <ViewImagesBtn />
    </div>
    <ShowImages />
  </HomePageContextProvider>
);

export default HomePage;
