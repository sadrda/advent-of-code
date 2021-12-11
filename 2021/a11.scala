def checkExplosion(field: Array[Array[Int]], checkField: Array[Array[Boolean]], x: Int, y: Int): Unit = {
  if(field(y)(x) <= 9 || checkField(y)(x)) return 
  checkField(y)(x) = true

  for(checkY <- y-1 to y+1) {
    for(checkX <- x-1 to x+1) {
      if(checkY >= 0 && checkX >= 0 && checkY < field.length && checkX < field(0).length){
        field(checkY)(checkX) += 1
        checkExplosion(field,checkField,checkX,checkY)
      }
    }
  }
}


def doStep(field: Array[Array[Int]]): Boolean = {
  for(y <- 0 until field.length) {
    for(x <- 0 until field(0).length) {
      field(y)(x) += 1
    }
  }

  val checkField=Array.fill(field.length, field(0).length)(false)
  for(y <- 0 until field.length) {
    for(x <- 0 until field(0).length) {
      checkExplosion(field,checkField,x,y)
    }
  }

  var flashCount = 0;
  for(y <- 0 until field.length) {
    for(x <- 0 until field(0).length) {
      if(field(y)(x) > 9) {
        field(y)(x) = 0
        flashCount+=1
      }
    }
  }
  flashCount == field.length * field.length
}



def main(args: Array[String]) = {
  val field = scala.io.Source.fromFile("a11.txt").mkString.split("\r\n").map(_.split("").map(_.toInt))

  var i = 0
  var found = false
  while(!found) {
    i+=1;
    if(doStep(field)) {
      println(i)
      found = true
    }
  }
}