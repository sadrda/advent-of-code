def factorialSum(n: Int): Int = n match {
    case 0 => 0
    case _ => n + factorialSum(n-1)
}

def main(args: Array[String]) = {
  val input = scala.io.Source.fromFile("a07.txt").mkString.split(",").map(_.toInt)

  val fuelCosts = Array.fill(input.max)(0)
  for(i <- 0 until input.max) {
    var sum = 0
    for(j <- 0 until input.length) {
      val curr = input(j)
      val biggerNum = i.max(curr)
      val smallerNum = i.min(curr)
      sum += factorialSum(biggerNum - smallerNum)
    }
    fuelCosts(i) = sum
  }
  println(fuelCosts.min)
}