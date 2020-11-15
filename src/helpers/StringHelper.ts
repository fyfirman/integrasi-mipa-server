const toTitleCase = (str : string) : string => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const StringHelper = {
  toTitleCase,
};

export default StringHelper;
