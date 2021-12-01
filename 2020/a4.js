const fs = require("fs")

const input = fs.readFileSync("./a4.txt", "utf8")

const isValidPassport = (requiredFields, passport) => {
  for (const requiredField of requiredFields) {
    let contains = false
    for (const passportField of Object.keys(passport)) {
      if (passportField === requiredField) contains = true
    }
    if (!contains) return false
  }
  for (const [key, value] of Object.entries(passport)) {
    switch (key) {
      case "byr": {
        const birthyear = Number(value)
        if (birthyear > 2002 || birthyear < 1920) return false
        break
      }
      case "iyr": {
        const issueYear = Number(value)
        if (issueYear > 2020 || issueYear < 2010) return false
        break
      }
      case "eyr": {
        const expirationYear = Number(value)
        if (expirationYear < 2020 || expirationYear > 2030)
          return false
        break
      }
      case "hgt": {
        let height = value
        if (height.includes("cm")) {
          height = Number(height.replace("cm", ""))
          if (height < 150 || height > 193) return false
        } else if (height.includes("in")) {
          height = Number(height.replace("in", ""))
          if (height < 59 || height > 76) return false
        } else return false
        break
      }
      case "hcl": {
        const hairColor = value
        if (!hairColor.match(/^#[0-9a-f]{6,6}$/i)) return false
        break
      }

      case "ecl": {
        const eyeColor = value
        if (
          eyeColor !== "amb" &&
          eyeColor !== "blu" &&
          eyeColor !== "brn" &&
          eyeColor !== "gry" &&
          eyeColor !== "grn" &&
          eyeColor !== "hzl" &&
          eyeColor !== "oth"
        )
          return false
        break
      }

      case "pid": {
        const passportId = value
        if (passportId.length !== 9) return false
        break
      }
    }
  }
  return true
}

const passports = input
  .split("\n\n")
  .map((passport) => passport.replace(/(\n)/g, " "))
  .map((passport) => {
    const keyValuePairs = passport.split(" ")
    const newPassport = {}
    keyValuePairs.forEach((pair) => {
      const splitPair = pair.split(":")
      newPassport[splitPair[0]] = splitPair[1]
    })
    return newPassport
  })

const requiredFields = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
]

const validPassports = passports.filter((passport) =>
  isValidPassport(requiredFields, passport)
)

console.log(input, validPassports.length)
