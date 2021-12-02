def main(args: Array[String]) = {

  val lines = scala.io.Source.fromFile("a2.txt").getLines.toArray.map(line => {
    val command = line.split(" ")
    (command(0), command(1).toInt)
  })
  
  var horizontalPos = 0;
  var depth = 0;
  var aim = 0;

  lines.foreach(command => {
    val (direction, quantity) = command
    direction match {
      case "forward" => {
        horizontalPos += quantity;
        depth += aim*quantity
      }
      case "up" => aim -= quantity
      case "down" => aim += quantity
    }
  })
  println(depth*horizontalPos)
}