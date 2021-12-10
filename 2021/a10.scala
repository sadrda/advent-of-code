import scala.collection.mutable.Stack
import scala.collection.mutable.Map

def main(args: Array[String]) = {
  val lines = scala.io.Source.fromFile("a10.txt").mkString.split("\r\n").map(_.split(""))

  val openingChars = Array("[","<","(", "{")

  val translation = Map(
      "]" -> "[",
      ")" -> "(",
      ">" -> "<",
      "}" -> "{",
    )  
  val charToPoints = Map(
      "(" -> 1,
      "[" -> 2,
      "{" -> 3,
      "<" -> 4,
    ) 

  val filteredLines = lines.filter(line => {
    val stack = Stack[String]()
    var errorFound = false
    line.foreach(char => {
      if(openingChars.contains(char)) stack.push(char)
      else {
        if(translation(char) == stack.top) stack.pop()
        else {
          if(!errorFound) {
            errorFound = true
          }
        }
      }
    })
    !errorFound
  })
  val scores = filteredLines.map(line => {
    val stack = Stack[String]()
    var score = 0L
    line.foreach(char => {
      if(openingChars.contains(char)) stack.push(char)
      else {
        if(translation(char) == stack.top) stack.pop()
      }
    })
    stack.foreach(char => score = score*5 +charToPoints(char))
    score
  })
  println(scores.sortWith(_>_)(Math.round((scores.length/2).toFloat)))
}