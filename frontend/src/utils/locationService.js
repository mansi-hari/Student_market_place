// utils/locationService.js

export const saveSelectedLocation = (location) => {
  if (location) {
    localStorage.setItem("selectedLocation", JSON.stringify(location));
  } else {
    localStorage.removeItem("selectedLocation");
  }
};

export const getSelectedLocation = () => {
  const location = localStorage.getItem("selectedLocation");
  return location ? JSON.parse(location) : null;
};