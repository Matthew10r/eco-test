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
  }, []);

  // reset all other filter when the selected breed filter change ( This is the main filter! )
  useEffect(
    () => () => {
      if (setSelectedSubBreed) {
        setSelectedSubBreed('');
      }
      setNumberOfImagesToShow(0);
    },
    [selectedBreed]
  );

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

  // check to see if the main Breed has been selected
  // if selected, check if that selected breed has sub breed
  // if so, let user select sub breed
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
      onClick={(target) => {
        if (setSelectedSubBreed) {
          setSelectedSubBreed(target as string);
        }
      }}
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

          if (data.message.length) {
            setPagination({
              // 10 is the size of the batch
              totalPageNumber: Math.ceil(data.message.length / 10),
              src: data.message,
              currentPage: 1,
            });
          }
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

          if (data.message.length) {
            setPagination({
              // 10 is the size of the batch
              totalPageNumber: Math.ceil(data.message.length / 10),
              src: data.message,
              currentPage: 1,
            });
          }
        }
      }
    })();

    return () => {
      setPagination({
        totalPageNumber: 0,
        src: [],
        currentPage: 0,
      });
    };
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
    numberOfImagesToShow,
    validated,
  } = useContext(HomePageContext);
  const [trackBatch, setTrackBatch] = useState<{ [key: number]: string[] }>();
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [data, setData] = useState<string[]>([]);

  // added Scroll event on Mount
  // if scroll to the bottom, check there's more data. If so, load more!
  useEffect(() => {
    const callback = () => {
      const container = document.getElementById('images-container');
      if (
        container &&
        container.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        setIsLoadMore(true);
      }
    };

    window.addEventListener('scroll', debounce(callback, 800));

    return () => window.removeEventListener('scroll', callback);
  }, []);

  // Loading more data by increasing currentPage
  useEffect(() => {
    if (
      isLoadMore &&
      pagination.src.length &&
      pagination.totalPageNumber !== pagination.currentPage
    ) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
    return () => setIsLoadMore(false);
  }, [pagination, isLoadMore]);

  // Adding more data into display!
  useEffect(() => {
    if (trackBatch?.[pagination.currentPage]) {
      setData((prev) => [...prev, ...trackBatch[pagination.currentPage]]);
    }
  }, [pagination.currentPage, trackBatch]);

  // Adding more batches of data into the tracking in order to load
  useEffect(() => {
    if (pagination.src.length) {
      const prevPosition = pagination.currentPage * 10 - 10;
      const nextPosition = pagination.currentPage * 10;

      const incomingBatch = pagination.src.slice(prevPosition, nextPosition);

      if (incomingBatch.length) {
        setTrackBatch((prev) => ({
          ...prev,
          [pagination.currentPage]: [...incomingBatch],
        }));
      }
    }
  }, [pagination.currentPage]);

  // reset when any of those filters changes
  useEffect(
    () => () => {
      setTrackBatch({});
      setData([]);
      setPagination({
        totalPageNumber: 0,
        src: [],
        currentPage: 0,
      });
    },
    [selectedBreed, selectedSubBreed, numberOfImagesToShow, validated]
  );

  return (
    <div id="images-container" className="min-h-imagesContainer">
      <div className="grid grid-cols-4 gap-4">
        {data.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`batch-${pagination.currentPage}-${index}`}
          />
        ))}
      </div>
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
