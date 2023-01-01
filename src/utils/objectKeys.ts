export const objectKeys = <T extends object>(obj: T) => (
  Object.keys(obj) as unknown as readonly (keyof T)[]
);
