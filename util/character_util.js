const findNextCharacter = (str, startIndex, character) => {
  if (character === '"') {
    for (let i = startIndex; i < str.length; i++) {
      if (str[i] === character) {
        return i;
      }
    }
  } else {
    let counter = 0;
    const brackets = new Map();
    brackets.set("[", "]");
    brackets.set("{", "}");

    for (let i = startIndex; i < str.length; i++) {
      if (str[i] === character) {
        counter++;
      } else if (str[i] === brackets.get(character)) {
        counter--;
        if (counter === 0) {
          return i;
        }
      }
    }
  }

  return startIndex;
};

const formatJson = (jsonData) => {
  let formattedJsonData = "";
  for (let i = 0; i < jsonData.length; i++) {
    if (
      jsonData[i] === "{" ||
      jsonData[i] === "}" ||
      jsonData[i] === ":" ||
      jsonData[i] === "[" ||
      jsonData[i] === "]" ||
      jsonData[i] === ","
    ) {
      formattedJsonData += jsonData[i];
    } else if (jsonData[i] === '"') {
      const index = findNextCharacter(jsonData, i + 1, jsonData[i]);
      //   console.log(jsonData.substr(i + 1, index - i - 1), jsonData[index]);
      formattedJsonData += jsonData.substr(i, index - i + 1);
      i = index;
    } else if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(jsonData[i])) {
      formattedJsonData += jsonData[i];
    }
  }
  return formattedJsonData;
};
// const getCharAfterColon = (str, startIndex) => {
//   for (let i = startIndex; i < str.length; i++) {
//     if (str[i] !== " ") {
//       return str[i];
//     }
//   }
//   return str[startIndex];
// };
module.exports = { findNextCharacter, formatJson };
