const fs = require("fs")

const input = fs.readFileSync("./a21.txt", "utf8")

const foods = input.split("\n").map((line) => {
  const splitLine = line.split(" (contains ")
  const ingredients = splitLine[0].split(" ")
  const allergens = splitLine[1]
    .split(", ")
    .map((allergen) => allergen.replace(")", ""))
  return { ingredients, allergens }
})

const ingredientContainer = []

foods.forEach((currentFood) => {
  currentFood.ingredients.forEach((currentIngredient) => {
    let exclusiveAllergen = false
    let isInOtherFood = false
    currentFood.allergens.forEach((currentAllergen) => {
      foods.forEach((otherFood) => {
        if (currentFood !== otherFood) {
          otherFood.allergens.forEach((otherAllergen) => {
            if (otherAllergen === currentAllergen) {
              isInOtherFood = true
              let foundIngredient = false
              otherFood.ingredients.forEach((otherIngredient) => {
                if (otherIngredient === currentIngredient) {
                  foundIngredient = true
                }
              })
              if (!foundIngredient) exclusiveAllergen = true
            }
          })
        }
      })
    })
    if (exclusiveAllergen && isInOtherFood) {
      ingredientContainer.push([currentIngredient, true])
    } else ingredientContainer.push([currentIngredient, false])
  })
})

const ingredientTable = []
ingredientContainer.forEach((ing1) => {
  if (ing1[1]) {
    let foundFalse = false
    ingredientContainer.forEach((ing2) => {
      if (ing1 !== ing2 && ing1[0] == ing2[0]) {
        if (!ing2[1]) foundFalse = true
      }
    })
    if (!foundFalse && !ingredientTable.find((i) => i === ing1[0]))
      ingredientTable.push(ing1[0])
  }
})
foods.forEach((food) => {
  const newIngredients = []
  food.ingredients.forEach((ingredient) => {
    if (!ingredientTable.find((nci) => nci === ingredient))
      newIngredients.push(ingredient)
  })
  food.ingredients = newIngredients
})

const allergenTree = {}
let i = 0
while (i < 10) {
  foods.forEach((food) => {
    food.allergens.forEach((allergen) => {
      if (!allergenTree[allergen]) {
        allergenTree[allergen] = [...food.ingredients]
      } else {
        allergenTree[allergen].forEach((ingredient, i) => {
          if (!food.ingredients.find((ing2) => ingredient === ing2)) {
            allergenTree[allergen].splice(i, 1)
          }
        })
      }
    })
  })
  Object.values(allergenTree).forEach((ings) => {
    if (ings.length === 1) {
      Object.values(allergenTree).forEach((ings2) => {
        if (ings2.length !== 1) {
          ings2.forEach((ing, j) => {
            if (ing === ings[0]) ings2.splice(j, 1)
          })
        }
      })
    }
  })
  i++
}

console.log(
  Object.keys(allergenTree)
    .sort()
    .reduce((acc, all) => (acc += allergenTree[all][0] + ","), ""),
)
