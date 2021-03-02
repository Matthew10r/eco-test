import Breeds from '@/services';

// types
import type { AxiosResponse } from 'axios';

export type GetAllBreeds = { [breed: string]: string[] };
interface GetAllBreedsResponse {
  message: GetAllBreeds;
  status: string;
}
interface GetBreedDetailsParams {
  type?: 'filter' | 'random';
  imagesToShow?: number;
  selectedBreed: string;
  selectedSubBreed?: string;
}

interface GetBreedDetailResponse {
  message: string[];
  status: string;
}

export const testing = () => console.log('This is a test!');

export const getAllBreeds = async (): Promise<
  AxiosResponse<GetAllBreedsResponse>
> => {
  const result = await Breeds.get('/breeds/list/all');
  return result;
};

export const getBreedDetails = async ({
  type = 'filter',
  imagesToShow = 0,
  selectedBreed,
  selectedSubBreed,
}: GetBreedDetailsParams): Promise<AxiosResponse<GetBreedDetailResponse>> => {
  let result: AxiosResponse<GetBreedDetailResponse>;

  if (selectedSubBreed && selectedSubBreed) {
    result = await Breeds.get(
      `/breed/${selectedBreed}/${selectedSubBreed}/images${
        type === 'random' ? `/random/${imagesToShow}` : ''
      }`
    );
  } else {
    result = await Breeds.get(
      `/breed/${selectedBreed}/images${
        type === 'random' ? `/random/${imagesToShow}` : ''
      }`
    );
  }

  return result;
};
