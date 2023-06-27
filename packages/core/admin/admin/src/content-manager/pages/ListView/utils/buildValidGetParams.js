const createPluginsFilter = (obj) =>
  Object.values(obj || {}).reduce((acc, current) => Object.assign(acc, current), {});

/**
 * @description
 * Creates a valid query params object
 * This includes:
 * - A filters clause
 * - Plugin options
 * @returns {object} - The modified query params
 */
const buildValidGetParams = (query = {}) => {
  // Extract pluginOptions from the query, they shouldn't be part of the URL
  const {
    plugins: _,
    _q: searchQuery,
    ...validQueryParams
  } = {
    ...query,
    ...createPluginsFilter(query.plugins),
  };

  if (searchQuery) {
    validQueryParams._q = encodeURIComponent(searchQuery);
  }

  return validQueryParams;
};

export default buildValidGetParams;
