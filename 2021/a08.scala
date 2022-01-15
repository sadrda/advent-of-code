def printSolutionTable(solutionTable: scala.collection.mutable.Map[String, Array[String]]) = {
  for ((k,v) <- solutionTable) printf("%s: %s\n", k, v.mkString(","))
}

def main(args: Array[String]) = {
  val lines = scala.io.Source.fromFile("a08.txt").mkString.split("\r\n").map(line => line.split(" \\| ").map(_.split(" ")))

  val one = Array("RIGHT_TOP", "RIGHT_BOT").sortWith(_>_)
  val two = Array("TOP", "RIGHT_TOP", "MID", "LEFT_BOT", "BOT").sortWith(_>_)
  val three = Array("TOP", "RIGHT_TOP", "MID", "RIGHT_BOT", "BOT").sortWith(_>_)
  val four = Array("RIGHT_TOP", "RIGHT_BOT", "MID", "LEFT_TOP").sortWith(_>_)
  val five = Array("TOP", "RIGHT_BOT", "MID", "LEFT_TOP", "BOT").sortWith(_>_)
  val six = Array("TOP", "RIGHT_BOT", "LEFT_BOT", "MID", "LEFT_TOP", "BOT").sortWith(_>_)
  val seven = Array("RIGHT_TOP", "RIGHT_BOT", "TOP").sortWith(_>_)
  val eight = Array("RIGHT_TOP", "RIGHT_BOT", "LEFT_TOP", "LEFT_BOT", "TOP", "MID", "BOT").sortWith(_>_)
  val nine = Array("RIGHT_TOP", "RIGHT_BOT", "LEFT_TOP", "TOP", "MID", "BOT").sortWith(_>_)
  val zero = Array("RIGHT_TOP", "RIGHT_BOT", "LEFT_TOP", "LEFT_BOT", "TOP", "BOT").sortWith(_>_)


  val ALL_POSITIONS = Array("RIGHT_TOP", "RIGHT_BOT", "LEFT_TOP", "LEFT_BOT", "TOP", "MID", "BOT")

  val uniqueNumbers = Array(one, four, seven, eight)
  val nonUniqueNumbers = Array(two, three, five, six, nine, zero)

  var sum = 0
  lines.foreach(line => {
    var solutionTable = scala.collection.mutable.Map(
      "RIGHT_TOP" -> Array("a","b","c","d","e","f","g"),
      "RIGHT_BOT" -> Array("a","b","c","d","e","f","g"),
      "LEFT_TOP" -> Array("a","b","c","d","e","f","g"),
      "LEFT_BOT" -> Array("a","b","c","d","e","f","g"),
      "TOP" -> Array("a","b","c","d","e","f","g"),
      "MID" -> Array("a","b","c","d","e","f","g"),
      "BOT" -> Array("a","b","c","d","e","f","g")
    )     
 
    val input = line(0)
    val output = line(1)

    // elim possibilities of unique numbers
    input.foreach(signal => {
      uniqueNumbers.foreach(uniqueNumber => {
        if(signal.length == uniqueNumber.length) {
          val signalChars = signal.split("")
          ALL_POSITIONS.foreach(position => {
            if(uniqueNumber.contains(position)) {
              solutionTable(position) = solutionTable(position).filter(allChar => signalChars.contains(allChar))
            }
            else {
              solutionTable(position) = solutionTable(position).filter(allChar => !signalChars.contains(allChar))
            }
          })
        }
      })
    }) 

    // solve 9
    input.foreach(signal => {
      if(solutionTable("LEFT_BOT").length != 1) {
        val signalChars = signal.split("")
        val containsOnlyBotOrLeftBot= 
          !(signalChars.contains(solutionTable("LEFT_BOT")(0)) && signalChars.contains(solutionTable("LEFT_BOT")(1))) 
        if(signalChars.length == 6 && containsOnlyBotOrLeftBot) {
          if(!signalChars.contains(solutionTable("LEFT_BOT")(0))) {
            solutionTable("LEFT_BOT") = Array(solutionTable("LEFT_BOT")(0))
            solutionTable("BOT") = Array(solutionTable("BOT")(1))
          }
          else {
            solutionTable("LEFT_BOT") = Array(solutionTable("LEFT_BOT")(1))
            solutionTable("BOT") = Array(solutionTable("BOT")(0))
          }
        }
      }
    })

    // solve 6
    input.foreach(signal => {
      if(solutionTable("RIGHT_TOP").length != 1) {
        val signalChars = signal.split("")
        val containsOnlyRightBotOrRightTop= 
          !(signalChars.contains(solutionTable("RIGHT_TOP")(0)) && signalChars.contains(solutionTable("RIGHT_TOP")(1))) 
        if(signalChars.length == 6 && containsOnlyRightBotOrRightTop) {
          if(!signalChars.contains(solutionTable("RIGHT_TOP")(0))) {
            solutionTable("RIGHT_TOP") = Array(solutionTable("RIGHT_TOP")(0))
            solutionTable("RIGHT_BOT") = Array(solutionTable("RIGHT_BOT")(1))
          }
          else {
            solutionTable("RIGHT_TOP") = Array(solutionTable("RIGHT_TOP")(1))
            solutionTable("RIGHT_BOT") = Array(solutionTable("RIGHT_BOT")(0))
          }
        }
      }
    })

    // solve 0
    input.foreach(signal => {
      if(solutionTable("MID").length != 1) {
        val signalChars = signal.split("")
        val containsOnlyMidOrLeftTop= 
          !(signalChars.contains(solutionTable("MID")(0)) && signalChars.contains(solutionTable("MID")(1))) 
        if(signalChars.length == 6 && containsOnlyMidOrLeftTop) {
          if(!signalChars.contains(solutionTable("MID")(0))) {
            solutionTable("MID") = Array(solutionTable("MID")(0))
            solutionTable("LEFT_TOP") = Array(solutionTable("LEFT_TOP")(1))
          }
          else {
            solutionTable("MID") = Array(solutionTable("MID")(1))
            solutionTable("LEFT_TOP") = Array(solutionTable("LEFT_TOP")(0))
          }
        }
      }
    })

    val chars = output.map(signal => {
      val signalChars = signal.split("")

      val validPositions = signalChars.map(char => {
        var pos =""
        ALL_POSITIONS.foreach(allPos => {
          if(solutionTable(allPos)(0) == char){
            pos = allPos
          }
        })
        pos
      })

      val sortedValidPositions = validPositions.sortWith(_>_)

      var char = ""
      if(sortedValidPositions.sameElements(one)) char = "1"
      if(sortedValidPositions.sameElements(two)) char = "2"
      if(sortedValidPositions.sameElements(three)) char = "3"
      if(sortedValidPositions.sameElements(four)) char = "4"
      if(sortedValidPositions.sameElements(five)) char = "5"
      if(sortedValidPositions.sameElements(six)) char = "6"
      if(sortedValidPositions.sameElements(seven)) char = "7"
      if(sortedValidPositions.sameElements(eight)) char = "8"
      if(sortedValidPositions.sameElements(nine)) char = "9"
      if(sortedValidPositions.sameElements(zero)) char = "0"
      char
    }) 
    sum +=chars.mkString.toInt

  })
  println(sum)
}