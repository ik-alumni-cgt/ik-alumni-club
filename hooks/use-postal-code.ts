import { useState, useEffect } from "react";

type AddressResult = {
  prefecture: string;
  city: string;
  town: string;
};

type ZipcloudResponse = {
  status: number;
  message: string | null;
  results: {
    zipcode: string;
    prefcode: string;
    address1: string;
    address2: string;
    address3: string;
  }[] | null;
};

export function usePostalCode(
  postalCode: string,
  onAddressFound: (address: AddressResult) => void,
): { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!/^\d{7}$/.test(postalCode)) {
      return;
    }

    const controller = new AbortController();

    const fetchAddress = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          return;
        }

        const data: ZipcloudResponse = await response.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          onAddressFound({
            prefecture: result.address1,
            city: result.address2,
            town: result.address3,
          });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("郵便番号検索エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();

    return () => {
      controller.abort();
    };
  }, [postalCode, onAddressFound]);

  return { isLoading };
}
