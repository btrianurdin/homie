import Supercluster, {
  AnyProps,
  ClusterFeature,
  PointFeature,
} from "supercluster";
import db from "~/server/database";
import HttpResponse from "~/server/exceptions/api-response";
import { GetRoom } from "~/types";

export default defineEventHandler(async (e) => {
  try {
    const { bounds, zoom, cluster_id } = await readBody(e);

    if (!bounds || !zoom) {
      return HttpResponse.badRequest(e, "Bounds and zoom are required.");
    }

    const rooms = await db.query.rooms.findMany({
      with: {
        galleries: {
          limit: 1,
        },
      },
      where: (rooms, { gte, lte, and, sql }) => {
        return and(
          // latitude form db is string
          gte(sql`CAST(${rooms.latitude} AS DECIMAL)`, bounds.south),
          lte(sql`CAST(${rooms.latitude} AS DECIMAL)`, bounds.north),
          gte(sql`CAST(${rooms.longitude} AS DECIMAL)`, bounds.west),
          lte(sql`CAST(${rooms.longitude} AS DECIMAL)`, bounds.east),
        );
      },
    });

    if (!rooms.length) {
      return HttpResponse.success(e, "Success", {
        rooms: [],
        total: 0,
      });
    }

    const geojsonFeatures = rooms.map(
      (room) =>
        ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Number(room.longitude), Number(room.latitude)],
          },
          properties: {
            ...room,
          },
        }) as Supercluster.PointFeature<GetRoom>,
    );

    const createCluster = new Supercluster({
      radius: 30,
      maxZoom: 15,
      minZoom: 6,
    });
    createCluster.load(geojsonFeatures);

    let clusters: (PointFeature<GetRoom> | ClusterFeature<GetRoom>)[];

    if (!cluster_id) {
      clusters = createCluster.getClusters(
        [bounds.west, bounds.south, bounds.east, bounds.north],
        zoom,
      ) as (PointFeature<GetRoom> | ClusterFeature<GetRoom>)[];
    } else {
      clusters = createCluster.getLeaves(cluster_id, Infinity) as (
        | PointFeature<GetRoom>
        | ClusterFeature<GetRoom>
      )[];
    }

    const lists = clusters
      .filter((location) => !("cluster" in location.properties))
      .map((location) => ({
        id: location.properties.id,
        price: location.properties.price,
        price_period: location.properties.pricePeriod,
        title: location.properties.title,
        address: location.properties.address,
        rating: location.properties.rating,
        rooms_available: location.properties.roomsAvailable,
        type: location.properties.type,
        gallery: location.properties.galleries[0]?.image,
      }));

    return HttpResponse.success(e, "Success", {
      rooms: lists,
      total: rooms.length,
    });
  } catch (error) {
    return HttpResponse.serverError(e, "Failed to get room lists.");
  }
});
