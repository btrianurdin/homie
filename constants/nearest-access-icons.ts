import type { HomiIconType } from "~/data/homi-icon-collections";

type NearestAccessIcons = Record<
  Capitalize<string>,
  {
    icon: HomiIconType;
    width?: number;
    height?: number;
  }
>;

const nearestAccessIcons: NearestAccessIcons = {
  CAFE: {
    icon: "cafe",
  },
  SEKOLAH: {
    icon: "school",
  },
  SUPERMARKET: {
    icon: "market",
  },
  MALL: {
    icon: "mall",
  },
  CLUB: {
    icon: "club",
  },
  WARUNGMAKAN: {
    icon: "food-court",
  },
  STASIUN: {
    icon: "train-station",
  },
  BILLIARD: {
    icon: "billiard-room",
  },
  MASJID: {
    icon: "mosque",
  },
  BANDARA: {
    icon: "airport",
  },
  APOTIK: {
    icon: "pharmacy",
  },
  ATM: {
    icon: "atm",
  },
  BANK: {
    icon: "bank",
  },
  HALTEBUS: {
    icon: "bus-stop",
  },
  SERVIS: {
    icon: "car-repair",
  },
  BAR: {
    icon: "bar",
  },
  UNIVERSITAS: {
    icon: "university",
  },
};


export default nearestAccessIcons;