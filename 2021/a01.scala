def main(args: Array[String]) = {
  val lines = scala.io.Source.fromFile("a01.txt").getLines.toArray.map(_.toInt)

  var depthCounter = 0
  for (i <- 0 until lines.length - 3) {
    var aCount = 0
    var bCount = 0

    for (j <- i to i + 2; k <- i + 1 to i + 3) {
      aCount += lines(j)
      bCount += lines(k)
    }
    if (bCount > aCount)
      depthCounter += 1
  }
  println(depthCounter)
}
