export const sample = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

export const randomIndex = (list: any[]): number => {
  const length = list.length;
  return Math.floor(Math.random() * length);
};
