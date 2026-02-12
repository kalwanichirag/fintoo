// CustomStyles.js
const customStyles = {
  control: (base) => ({
    ...base,
    border: "none",
    borderBottom: "1px solid #ddd",
    borderRadius: "0",
    boxShadow: "none",
    "&:hover": {
      borderBottom: "1px solid #ddd",
    },
  }),
  option: (base, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...base,
      backgroundColor: isFocused ? "#ffff" : "#042b62",
      color: isFocused ? "#000" : "#fff",
      cursor: "pointer",
    };
  },
  menuList: (base) => ({
    ...base,
    height: "100px",
    overflowY: "scroll",
    scrollBehavior: "smooth",
    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#fff",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#042b62",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  }),
};

export default customStyles;
