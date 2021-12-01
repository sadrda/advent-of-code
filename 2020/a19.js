const fs = require("fs")

const input = fs.readFileSync("./a19.txt", "utf8")

const splitInput = input.split("\n\n")
const rules = splitInput[0]
const messages = splitInput[1].split("\n")

const ruleBook = {}

rules.split("\n").forEach(rule => {
    const splitRule = rule.split(": ")
    const index = splitRule[0]
    const instructionRaw = splitRule[1]
    if(instructionRaw.includes("|")) {
        const splitInstruction = instructionRaw.split(" | ")
        ruleBook[index] = []
        ruleBook[index].push(splitInstruction[0].split(" ").map(Number))
        ruleBook[index].push(splitInstruction[1].split(" ").map(Number))
    }
    else if(instructionRaw.includes("\"")) {
        const endpoint = instructionRaw.split("\"")
        ruleBook[index] = [endpoint[1][0]]
    }
    else {
        ruleBook[index] = [instructionRaw.split(" ").map(Number)]
    }
})


const combineRules = (rule1, rule2) => {
    const newRule = []
    if (rule1.length === 0) {
        rule1 = [""]
    }
    if (rule2.length === 0) {
        rule2 =[""]
    }
    rule1.forEach(str1 => {
        rule2.forEach(str2=> {
            newRule.push(str1+str2)
        })
    })
    return newRule
}

const ruleCombiner = (acc, current) => combineRules(acc, getRule(current))

const getRule = (index) => {
    const rule = ruleBook[index]

    if(rule.length === 1 && typeof rule[0] === "string")
        return rule
    else {
        if(rule.length === 1) {
            return rule[0].reduce(ruleCombiner, [])
        }
        else {
            const newRules1 = rule[0].reduce(ruleCombiner, [])
            const newRules2 = rule[1].reduce(ruleCombiner, [])
            return [...newRules1, ...newRules2]
        }
    }
}

const rule42 = getRule(42)
const rule31 = getRule(31)
const rule42Length = rule42[0].length

const sum = messages.reduce((acc, message) => {

    const splitMessage = message.split("")
    const messageLength = splitMessage.length
    let foundStart = false
    for (const str of rule42) {
        if(message.startsWith(str)){
            foundStart = true
            break
        }
    }
    if(!foundStart) {
        return acc
    }
    foundStart = false
    for (const str of rule42) {
        if(message.slice(rule42Length,rule42Length*2) === str) {
            foundStart = true
            break
        }
    }
    if(!foundStart) {
        return acc
    }

    let rule42Count = 1;
    let rule31Count = 0;
    for(let i = rule42Length*2; i<messageLength; i+= rule42Length) {
        const nextMessage = message.slice(i,i+rule42Length)
        let found = false
        for(const rule31String of rule31){
            if(nextMessage === rule31String){
                rule31Count++
                found = true
                if (i + rule42Length === messageLength && rule31Count <= rule42Count)
                    return ++acc
            }
        }
        for(const rule42String of rule42){
            if(nextMessage === rule42String){
                rule42Count++
                found = true
            }
        }
        if(!found)
            return acc
    }
    return acc

}, 0)
console.log("sum", sum);


