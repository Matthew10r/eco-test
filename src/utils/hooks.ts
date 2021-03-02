import { useEffect, useRef, useState } from 'react';

export const testing = () => console.log('This is a test!');

export const useLoading = (): [
  boolean,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => {
        setLoading(false);
        setIsError(true);
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loading]);

  return [loading, isError, setLoading];
};
