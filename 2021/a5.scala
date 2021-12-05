def main(args: Array[String]) = {
  val input = scala.io.Source.fromFile("a5.txt").mkString
  val commands = input.split("\r\n").map(_.split(" -> ").map(_.split(",").map(_.toInt)))
  
  val lines = commands

  var maxX = 0
  var maxY = 0

  lines.foreach(_.foreach(point => {
    if(point(0) > maxX) maxX = point(0)
    if(point(1) > maxY) maxY = point(1)
  }))
  val field = Array.fill(maxY+1,maxX+1)(0)

  lines.foreach(line => {
    val lowerX = line(0)(0).min(line(1)(0))
    val higherX = line(0)(0).max(line(1)(0))

    val lowerY = line(0)(1).min(line(1)(1))
    val higherY = line(0)(1).max(line(1)(1))

    if(lowerY == higherY || lowerX == higherX) {
      for(y <- lowerY to higherY){ 
        for(x <- lowerX to higherX){ 
          field(y)(x) += 1
        }
      }
    }
    else {
      val xDecreasing = line(0)(0) > line(1)(0)
      val yDecreasing = line(0)(1) > line(1)(1)
      for(n <- 0 to (higherY-lowerY)) {
        val y = if(yDecreasing) higherY-n else lowerY+n
        val x = if(xDecreasing) higherX-n else lowerX+n
        field(y)(x) += 1
      }
    }
  })

  var sum = 0
  field.foreach(_.foreach(num => {
    if(num >= 2) sum+=1
  }))

  println(sum)
}