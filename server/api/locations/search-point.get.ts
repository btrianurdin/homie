import { MapboxGeoJSONFeature } from "mapbox-gl";
import HttpResponse from "~/server/exceptions/api-response";

type SearchResponse = {
  features: MapboxGeoJSONFeature[];
};

export default defineEventHandler(async (e) => {
  const { lat, lng } = getQuery(e);

  if (!lat || !lng) {
    return HttpResponse.badRequest(e, "Latitude and longitude are required");
  }

  const token = process.env.NUXT_PUBLIC_MAP_BOX_API;
  const locations: SearchResponse = await $fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&types=neighborhood&access_token=${token}`,
  );

  const feature = locations.features[0];
  const fullAddress = feature.properties?.full_address;
  const bbox = feature.properties?.bbox;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return HttpResponse.success(e, "Success", {
    full_address: fullAddress,
    bbox,
  });
});
