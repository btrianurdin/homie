import type { HttpResponse, LocationSuggestResponse } from "~/types";

const locationSuggest = async (keyword: string) => {
  const res = await $fetch("/api/public/locations/suggest", {
    params: {
      keyword,
    },
  });

  return res as HttpResponse<{ locations: LocationSuggestResponse[] }>;
};

export default locationSuggest;
