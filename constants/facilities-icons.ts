import type { HomiIconType } from "~/data/homi-icon-collections";

type FacilitiesIcons = Record<
  Capitalize<string>,
  {
    icon: HomiIconType;
    width?: number;
    height?: number;
  }
>;

const facilitiesIcons: FacilitiesIcons = {
  LISTRIK: {
    icon: "electrical",
  },
  JETSHOWER: {
    icon: "jet-shower",
  },
  SHOWERMANDI: {
    icon: "shower",
  },
  EMBERKM: {
    icon: "bucket",
  },
  TVKAMAR: {
    icon: "tv",
  },
  LEMARI: {
    icon: "cupboard",
  },
  PARKIRMOTOR: {
    icon: "motorcycle-parking",
  },
  PARKIRMOBIL: {
    icon: "car-parking",
  },
  PARKIRSEPEDA: {
    icon: "bicyle",
  },
  AKSES24: {
    icon: "24-hours",
  },
  BANTAL: {
    icon: "pillow",
  },
  DAPURKAMAR: {
    icon: "room-kitchen",
  },
  DAPURBERSAMA: {
    icon: "kitchen",
  },
  KARTUAKSES: {
    icon: "card",
  },
  BALKON: {
    icon: "balcony",
  },
  JEMURANKAMAR: {
    icon: "dry-cleaning",
  },
  JEMURANBERSAMA: {
    icon: "clothesline",
  },
  AC: {
    icon: "ac",
  },
  CERMIN: {
    icon: "mirror",
  },
  CLEANING: {
    icon: "cleaning",
  },
  DISPENSERKAMAR: {
    icon: "water",
  },
  KASUR: {
    icon: "bed",
  },
  KLDUDUK: {
    icon: "closet",
  },
  KLJONGKOK: {
    icon: "squat-closet",
  },
  CCTV: {
    icon: "cctv",
  },
  KMDALAM: {
    icon: "bathroom",
  },
  KMLUAR: {
    icon: "outside-bathroom",
  },
  KULKASBERSAMA: {
    icon: "freezer",
  },
  KULKASKAMAR: {
    icon: "freezer",
  },
  KURSI: {
    icon: "chair",
  },
  MEJA: {
    icon: "table",
  },
  LAUNDRY: {
    icon: "laundry",
  },
  RUANGTAMU: {
    icon: "sitting-room",
  },
  SECURITY: {
    icon: "security",
  },
  TVBERSAMA: {
    icon: "public-tv",
  },
  WIFI: {
    icon: "wifi",
  },
};

export default facilitiesIcons;
