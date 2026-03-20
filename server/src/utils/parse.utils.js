const parseOrigins = (origins) => {
  if (!origins) return [];

  return origins
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
};

export const parseUtils = {
  parseOrigins
};