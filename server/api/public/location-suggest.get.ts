import { MapboxGeoJSONFeature } from "mapbox-gl";
import HttpResponse from "~/server/exceptions/api-response";

type SearchResponse = {
  features: MapboxGeoJSONFeature[];
};

export default defineEventHandler(async (e) => {
  const { keyword } = getQuery(e);

  if (!keyword) {
    return HttpResponse.badRequest(e, "Keyword is required");
  }

  const token = process.env.NUXT_PUBLIC_MAP_BOX_API;
  const locations: SearchResponse = await $fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${keyword}&access_token=${token}&language=id&country=id`,
  );

  const features = locations.features?.map((feature) => {
    const { properties } = feature;
    return {
      coordinates: [
        properties?.coordinates.longitude,
        properties?.coordinates.latitude,
      ],
      city_name: properties?.name_preferred,
      address: properties?.full_address,
      address_formated: properties?.place_formatted,
      bbox: properties?.bbox,
    };
  });

  return HttpResponse.success(e, "Success", {
    locations: features,
    tes: locations,
  });
});
