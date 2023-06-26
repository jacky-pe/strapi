const createPluginsFilter = (obj) =>
  Object.values(obj || {}).reduce((acc, current) => Object.assign(acc, current), {});

/**
 * @description
 * Creates a valid query params object
 * This includes:
 * - A filters clause
 * - Plugin options
 * @param {object} [queryParams={}] - The current query params
 * @returns {object} - The modified query params
 */
const buildValidQueryParams = (queryParams = {}) => {
  console.log(queryParams.plugins, createPluginsFilter(queryParams.plugins));
  // Extract pluginOptions from the query,they shouldn't be part of the URL
  const { _q: searchQuery, ...validQueryParams } = {
    ...queryParams,
    ...createPluginsFilter(queryParams.plugins),
  };

  if (searchQuery) {
    validQueryParams._q = encodeURIComponent(searchQuery);
  }

  return validQueryParams;
};

export default buildValidQueryParams;
