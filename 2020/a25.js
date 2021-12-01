const key1 = 2069194
const key2 = 16426071

const divider = 20201227
const maxLoopSize = Infinity
let subjectNumber = 7
let val = 1

let key1LoopSize = null
let key2LoopSize = null
for (let i = 1; i < maxLoopSize; i++) {
  val *= subjectNumber
  val %= divider
  if (val === key1) {
    key1LoopSize = i
    break
  }
}
val = 1
for (let i = 1; i < maxLoopSize; i++) {
  val *= subjectNumber
  val %= divider
  if (val === key2) {
    key2LoopSize = i
    break
  }
}

val = 1
subjectNumber = key1
for (let i = 0; i < key2LoopSize; i++) {
  val *= subjectNumber
  val %= divider
}
console.log(val)
