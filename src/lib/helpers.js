// lib/helper.js
export const updateQueryParams = (router, searchParams, newParams) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  router.push(`?${params.toString()}`, { scroll: false });
};