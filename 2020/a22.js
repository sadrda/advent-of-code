const fs = require("fs")

const input = fs.readFileSync("./a22.txt", "utf8")

const rawDecks = input.split("\n\n")

const decks = rawDecks.map((rawDeck) => {
  const deck = []
  rawDeck.split("\n").forEach((num, y) => {
    if (y !== 0) deck.push(+num)
  })
  return deck
})
const deck1 = decks[0]
const deck2 = decks[1]

const isOver = (deck1, deck2) =>
  deck1.length === 0 || deck2.length === 0

const game = (deck1, deck2) => {
  const deckHistories = []
  while (!isOver(deck1, deck2)) {
    let foundOldDeck = false
    deckHistories.forEach(([oldDeck1, oldDeck2]) => {
      if (
        JSON.stringify(oldDeck1) === JSON.stringify(deck1) &&
        JSON.stringify(oldDeck2) === JSON.stringify(deck2)
      )
        foundOldDeck = true
    })
    if (foundOldDeck) return [deck1, deck2, "rec"]
    deckHistories.push([[...deck1], [...deck2]])
    const card1 = deck1.shift()
    const card2 = deck2.shift()

    let winner = null
    if (deck1.length >= card1 && deck2.length >= card2) {
      const gameResult = game(
        deck1.slice(0, card1),
        deck2.slice(0, card2),
      )
      if (gameResult.length === 3) winner = "player1"
      else {
        if (gameResult[0].length === 0) winner = "player2"
        else winner = "player1"
      }
    } else if (card1 > card2) {
      winner = "player1"
    } else if (card1 < card2) {
      winner = "player2"
    }

    if (winner === "player2") deck2.push(card2, card1)
    else deck1.push(card1, card2)
  }
  return [deck1, deck2]
}
const finalDecks = game(deck1, deck2)

const countPoints = (deck) =>
  deck.reduce((acc, curr, y) => acc + curr * (deck.length - y), 0)

const winnerPoints =
  finalDecks[0].length !== 0
    ? countPoints(finalDecks[0])
    : countPoints(finalDecks[1])

console.log(winnerPoints)
