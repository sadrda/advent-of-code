def repopulate(fishCount: Array[Long]) = {
  val newFishCount = Array.fill(9)(0L)
  for(n <- 0 until 9) {
    if(n == 8) newFishCount(8) = fishCount(0)
    else newFishCount(n) = fishCount(n+1)
  }
  newFishCount(6) += fishCount(0)
  newFishCount
}

def main(args: Array[String]) = {
  var fishes = scala.io.Source.fromFile("a6.txt").mkString.split(",").map(_.toInt)
  
  var fishCount = Array.fill(9)(0L)
  for(fish <- fishes) {
    fishCount(fish) += 1
  }

  for(n <- 0 until 256) {
    fishCount = repopulate(fishCount)
  }
  println(fishCount.sum)
}