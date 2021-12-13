def fold(paper: Array[Array[Boolean]], instruction: (String, Int)): Unit = {
  val newPaper = Array.fill(paper.length, paper(0).length)(false)

  val foldingNum = instruction(1)
  if(instruction(0) == "y") {
    for(y <- 0 until foldingNum) {
      for(x <- 0 until paper(0).length) {
        newPaper(y)(x) = paper(y)(x)
      }
    }
    for(y <- 1 to foldingNum) {
      for(x <- 0 until paper(0).length) {
        if(!newPaper(foldingNum-y)(x))
          newPaper(foldingNum-y)(x) = paper(foldingNum+y)(x)
      }
    }
  }
  if(instruction(0) == "x") {
    for(y <- 0 until paper.length) {
      for(x <- 0 until foldingNum) {
        newPaper(y)(x) = paper(y)(x)
      }
    }
    for(y <- 0 until paper.length) {
      for(x <- 1 to foldingNum) {
        if(!newPaper(y)(foldingNum-x))
          newPaper(y)(foldingNum-x) = paper(y)(foldingNum+x)
      }
    }
  }

  for(y <- 0 until newPaper.length) {
    for(x <- 0 until newPaper(0).length) {
      paper(y)(x) = newPaper(y)(x)
    }
  }
}       
def main(args: Array[String]) = {
  val input = scala.io.Source.fromFile("a13.txt").mkString.split("\r\n\r\n")

  val holes = input(0).split("\r\n").map(_.split(",").map(_.toInt))
  val instructions = input(1).split("\r\n").map(line => {
    val eq = line.split(" ")(2).split("=")
    (eq(0), eq(1).toInt)
  })

  var maxX = 0
  var maxY = 0

  holes.foreach(hole => {
    if(hole(0) > maxX) maxX = hole(0)
    if(hole(1) > maxY) maxY = hole(1)
  })

  val paper = Array.fill(maxY+1,maxX+1)(false)
  holes.foreach(hole => {
    paper(hole(1))(hole(0)) = true
  })

  instructions.foreach(instruction=> fold(paper,instruction))

  val numPaper = Array.fill(paper.length,paper(0).length)(" ")
  for(y <- 0 until paper.length) {
    for(x <- 0 until paper(0).length) {
      if(paper(y)(x)) numPaper(y)(x) = "O"
    }
  }

  numPaper.slice(0,6).foreach(e => println(e.slice(0,40).mkString(",")))
}