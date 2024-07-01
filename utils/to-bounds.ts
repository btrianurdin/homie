const toBounds = (coordinates: number[]) => {
  return {
    north: coordinates[0],
    east: coordinates[1],
    south: coordinates[2],
    west: coordinates[3],
  };
};

export default toBounds;