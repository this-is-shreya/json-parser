const fs = require("fs");
const { findNextCharacter, formatJson } = require("./util/character_util");

const setData = (str) => {
  const strWithoutDoubleQuotes = str.replace(/"/g, "");

  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(strWithoutDoubleQuotes)) {
    const num = Number(strWithoutDoubleQuotes);
    const modifiedNumToString = String(num);
    // console.log(num, modifiedNumToString);
    if (modifiedNumToString.length === strWithoutDoubleQuotes.length) {
      return num;
    } else {
      return strWithoutDoubleQuotes;
    }
  } else if (str === '"true"') {
    return true;
  } else if (str === '"false"') {
    return false;
  } else if (str === '"null"') {
    return null;
  } else if (str === '"undefined"') {
    return undefined;
  } else if (str[0] === "{") {
    if (str[str.length - 1] !== "}") {
      throw "no closing '}' bracket found for " + str;
    }
    return parseJson(str);
  } else if (str[0] === "[") {
    if (str[str.length - 1] !== "]") {
      throw "no closing ']' bracket found";
    }
    // console.log("array recived ", str);
    str = str.slice(1, -1);

    let arr = [];
    for (let i = 0; i < str.length; i++) {
      let tempObj = {};
      // console.log("str[i] is ", str[i]);
      if (str[i] === "[") {
        const nextCharIndex = findNextCharacter(str, i, str[i]);
        const val = str.substr(i, nextCharIndex - i + 1);
        // console.log("val sent from arr", val);
        if (val[0] === "[") {
          arr.push(setData(val));
        } else {
          val.split(",").forEach((element) => {
            arr.push(setData(element));
          });
        }
        i = nextCharIndex;
      } else if (str[i] === "{") {
        const nextCharIndex = findNextCharacter(str, i, str[i]);
        const val = str.substr(i, nextCharIndex - i + 1);
        // console.log("json here is ", val);
        tempObj = setData(val);
        i = nextCharIndex;
        arr.push(tempObj);
      } else if (str[i] !== ",") {
        arr = str.split(",").reduce((acc, item) => {
          acc.push(setData(item));
          return acc;
        }, []);
        break;
      }
    }
    return arr;
  } else {
    return str.slice(1, -1);
  }
};
const parseJson = (jsonData) => {
  // console.log("JSON ", jsonData);
  if (jsonData === "{}" || jsonData === "[]") {
    return jsonData;
  }

  let parsedJson = {};

  if (jsonData[0] === "{") {
    jsonData = jsonData.substr(1, jsonData.length - 1);
  }
  if (jsonData[jsonData.length - 1] === "}") {
    jsonData = jsonData.substr(0, jsonData.length - 1);
  }

  let key;

  for (let i = 0; i < jsonData.length; i++) {
    if (jsonData[i] === '"') {
      const nextQuotation = findNextCharacter(jsonData, i + 1, '"');
      key = jsonData.substr(i, nextQuotation - i + 1);
      // console.log("key sent", key);
      key = setData(key);
      // console.log("key received", key);
      i = nextQuotation + 1;
    }
    if (jsonData[i] === ":") {
      const nextCharAfterColon = jsonData[i + 1];
      let nextCharIndex;
      // console.log("nextcharaftercolon", nextCharAfterColon);
      if (nextCharAfterColon !== '"') {
        if (/^[a-z0-9]*$/gi.test(nextCharAfterColon)) {
          throw "value not in double quotes";
        } else if (nextCharAfterColon === "{" || nextCharAfterColon === "[") {
          nextCharIndex = findNextCharacter(
            jsonData,
            i + 1,
            nextCharAfterColon
          );
        } else {
          throw "invalid character";
        }
      } else {
        nextCharIndex = findNextCharacter(jsonData, i + 2, '"');
      }
      value = jsonData.substr(i + 1, nextCharIndex - i);
      // console.log("value sent", value);

      value = setData(value);
      // console.log("value receivedh", value);
      parsedJson[key] = value;
      i = nextCharIndex;
    }
  }

  return parsedJson;
};

fs.readFile("./data/sample.txt", (err, data) => {
  if (err) {
    console.log("err", err);
  }

  let json = parseJson(formatJson(data.toString()));
  console.log(json);
  // let fjson = formatJson(data.toString());
  // console.log(fjson);
});
