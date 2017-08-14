import { createSelector } from 'reselect';

export default function createCachedSelector(...funcs) {
  let cache = {};

  return (resolver, selectorCreator = createSelector) => {
    const selector = function(...args) {
      // Application receives this function
      const cacheKey = resolver(...args);

      if (typeof cacheKey === 'string' || typeof cacheKey === 'number') {
        if (cache[cacheKey] === undefined) {
          cache[cacheKey] = selectorCreator(...funcs);
        }
        return cache[cacheKey](...args);
      }
      return undefined;
    };

    // Further selector methods
    selector.getMatchingSelector = (...args) => {
      const cacheKey = resolver(...args);
      return cache[cacheKey];
    };

    selector.removeMatchingSelector = (...args) => {
      const cacheKey = resolver(...args);
      if (cache[cacheKey] !== undefined) {
        cache[cacheKey] = undefined;
      }
    };

    selector.clearCache = () => {
      cache = {};
    };

    selector.resultFunc = funcs[funcs.length -1];

    return selector;
  }
}
