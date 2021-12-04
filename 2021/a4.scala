
def boardHasWon(board: Array[Array[String]], currentWinningNumbers: Array[String]) = {
  var hasWon = false
  for(line <- board) {
    if(line.forall(number => currentWinningNumbers.contains(number)))
      hasWon = true
  }
  for(x <- 0 until board(0).length) {
    var columnIsCompleted = true
    for(y <- 0 until board.length) {
      if(!currentWinningNumbers.contains(board(y)(x)))
        columnIsCompleted = false
    }
    if(columnIsCompleted) hasWon = true
  }

  hasWon
}

def getFinalScore(board: Array[Array[String]], currentWinningNumbers: Array[String]) = {
  var score = 0;
  board.foreach(_.foreach(num => {
    if(!currentWinningNumbers.contains(num)) score += num.toInt
  }))
  score * currentWinningNumbers.last.toInt
}

def main(args: Array[String]) = {
  val input = scala.io.Source.fromFile("a4.txt").mkString.split("\r\n\r\n")
  val winningNumbers = input(0).split(",")
  val boards = input.drop(1).map(line => line.split("\r\n").map(_.split(" +").filter(_.length > 0)))

  var nextToWin = false;
  for(i <- 0 until winningNumbers.length) {
    val currentWinningNumbers = winningNumbers.slice(0, i);
    for(board <- boards) {
      if(!boardHasWon(board, currentWinningNumbers.dropRight(1)) && boards.forall(b => boardHasWon(b, currentWinningNumbers))) {
        println(getFinalScore(board, currentWinningNumbers))
        System.exit(0)
      }
    }
  }
}