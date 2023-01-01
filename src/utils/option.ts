export const option = <T>(func: () => T): T | undefined => {
  try {
    return func();
  } catch {
    return;
  }
};
