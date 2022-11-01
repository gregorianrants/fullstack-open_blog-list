const { isEqual } = require("lodash")

function isEqualToOneOff(inputObj, arrOfObjects) {
  for (const obj of arrOfObjects) {
    if (isEqual(obj, inputObj)) return true
  }
  return false
}

const extension = (obj, arrayOfObjects) => {
  if (!isEqualToOneOff(obj, arrayOfObjects)) {
    return {
      pass: false,
      message: () => "is not equal to any of the objects in the array",
    }
  }
  return {
    pass: true,
    message: () => `obj matches one on the the objects in the array`,
  }
}

module.exports = extension

// console.log(isEqualToOneOff({ name: "g" }, [{ name: "g" }]))
// console.log(isEqualToOneOff({ name: "g" }, [{ name: "g" }, { name: "g" }]))
// console.log(isEqualToOneOff({ name: "g" }, [{ name: "g" }, { name: "b" }]))
// console.log(isEqualToOneOff({ name: "g" }, [{ name: "a" }, { name: "a" }]))
// console.log(isEqualToOneOff({ name: "g" }, []))
