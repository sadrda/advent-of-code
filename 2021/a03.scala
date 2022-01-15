def main(args: Array[String]) = {
  val bits = scala.io.Source.fromFile("a03.txt").getLines.toArray.map(_.split(""))

  val zeroCount = Array.fill(bits(0).length)("0")
  val oneCount =  Array.fill(bits(0).length)("0")
  bits.foreach(line => {
    for(i <- 0 until line.length) {
      val bit = line(i)
      if(bit == "0") zeroCount(i) += 1
      if(bit == "1") oneCount(i) += 1
    }
  })

  var validBits = bits.clone()

  for(x <- 0 until bits(0).length) {

    var zeroCount = 0
    var oneCount = 0
    for(y <- 0 until validBits.length) {
        val bit = validBits(y)(x)
        if(bit == "0") zeroCount += 1
        if(bit == "1") oneCount += 1
    }
    val filterChar = if(zeroCount > oneCount) "0" else "1"
    validBits = validBits.filter(line => line(x) == filterChar)
  }
  val oxygenRate = validBits(0).mkString("")

  validBits = bits.clone()
  for(x <- 0 until bits(0).length) {
    if(validBits.length != 1) {
      var zeroCount = 0
      var oneCount = 0
      for(y <- 0 until validBits.length) {
          val bit = validBits(y)(x)
          if(bit == "0") zeroCount += 1
          if(bit == "1") oneCount += 1
      }
      val filterChar = if(zeroCount <= oneCount) "0" else "1"
      validBits = validBits.filter(line => line(x) == filterChar)
    }
  }
  val co2Rate = validBits(0).mkString("")

  val oxygenDecimal = Integer.parseInt(oxygenRate.mkString(""),2)
  val co2Decimal = Integer.parseInt(co2Rate.mkString(""),2)
  println(oxygenDecimal * co2Decimal) 
}