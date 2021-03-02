import Breeds from '@/services';

// types
import type { AxiosResponse } from 'axios';

export type GetAllBreeds = { [breed: string]: string[] };

interface GetAllBreedsResponse {
  message: GetAllBreeds;
  status: string;
}

export const testing = () => console.log('This is a test!');

export const getAllBreeds = async (): Promise<
  AxiosResponse<GetAllBreedsResponse>
> => {
  const result = await Breeds.get('/breeds/list/all');
  return result;
};
