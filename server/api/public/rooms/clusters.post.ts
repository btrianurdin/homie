import HttpResponse from "~/server/exceptions/api-response";
import SuperCluster from "supercluster";
import db from "~/server/database";

export default defineEventHandler(async (e) => {
  try {
    const { bounds, zoom } = await readBody(e);

    if (!bounds || !zoom) {
      return HttpResponse.badRequest(e, "Bounds and zoom are required.");
    }

    const rooms = await db.query.rooms.findMany({
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
        clusters: [],
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
            id: room.id,
            price: room.price,
          },
        }) as SuperCluster.PointFeature<{ id: string; price: string }>,
    );

    const createCluster = new SuperCluster({
      radius: 30,
      maxZoom: 15,
      minZoom: 6,
    });
    createCluster.load(geojsonFeatures);

    const clusters = createCluster
      .getClusters([bounds.west, bounds.south, bounds.east, bounds.north], zoom)
      .map((cluster) => {
        if (cluster.properties.cluster) {
          return {
            cluster_id: cluster.properties.cluster_id,
            is_cluster: true,
            point_count: cluster.properties.point_count,
            coordinates: cluster.geometry.coordinates,
          };
        }
        return {
          is_cluster: false,
          coordinates: cluster.geometry.coordinates,
          price: cluster.properties.price,
        };
      });

    return HttpResponse.success(e, "Success", {
      clusters,
      total: rooms.length,
    });
  } catch (error) {
    return HttpResponse.serverError(e, "Failed to get room lists.");
  }
});
