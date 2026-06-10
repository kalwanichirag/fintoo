export const clearLocalStorageExcept = (keysToKeep = []) => {
  try {
    const keep = {};
    keysToKeep.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        keep[key] = value;
      }
    });

    localStorage.clear();

    Object.keys(keep).forEach((key) => {
      localStorage.setItem(key, keep[key]);
    });
  } catch (error) {
    console.error("Failed to clear localStorage safely:", error);
  }
};
