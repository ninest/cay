export const dedup = (list: any[]) => {
  return [
    // Remove duplicates
    ...new Set(list),
  ];
};
