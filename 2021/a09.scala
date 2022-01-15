import scala.collection.mutable.ArrayBuffer

def flow(field: Array[Array[Int]], checkField: Array[Array[Boolean]], x:Int, y:Int): Unit = {
  if(checkField(y)(x) || field(y)(x) == 9) return
  checkField(y)(x) = true
  if(y+1 < field.length && field(y+1)(x) > field(y)(x)) flow(field, checkField, x, y+1)
  if(y-1 >= 0 && field(y-1)(x) > field(y)(x)) flow(field, checkField, x, y-1)
  if(x+1 < field(0).length && field(y)(x+1) > field(y)(x)) flow(field, checkField, x+1, y)
  if(x-1 >= 0 && field(y)(x-1) > field(y)(x)) flow(field, checkField, x-1, y)
}

def main(args: Array[String]) = {
  val field = scala.io.Source.fromFile("a09.txt").mkString.split("\r\n").map(line=>line.split("").map(_.toInt))

  var lowSum = 0;

  val basinSizes = new ArrayBuffer[Int]()

  for(y <- 0 until field.length) {
    for(x <- 0 until field(0).length) {
      val currNum = field(y)(x)
      val topIsLargerOrDoesntExist = y-1 < 0 || field(y-1)(x) > currNum 
      val botIsLargerOrDoesntExist = y+1 >= field.length || field(y+1)(x) > currNum 
      val leftIsLargerOrDoesntExist = x-1 < 0 || field(y)(x-1) > currNum 
      val rightIsLargerOrDoesntExist = x+1 >= field(0).length || field(y)(x+1) > currNum 
      if(topIsLargerOrDoesntExist && botIsLargerOrDoesntExist && leftIsLargerOrDoesntExist && rightIsLargerOrDoesntExist) {
        val checkField = Array.fill(field.length, field(0).length)(false)
        flow(field, checkField, x, y)
        var sum = 0
        checkField.foreach(_.foreach(f => if(f) sum+=1))
        basinSizes+=sum
      }
    }
  }
  val sortedSizes = basinSizes.sortWith(_>_)
  println(sortedSizes(0)*sortedSizes(1)*sortedSizes(2))
  println(sortedSizes.mkString(","))

}
//803225