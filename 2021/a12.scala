import scala.collection.mutable.ArrayBuffer

def addPaths(paths: Array[Array[String]], currentPath: ArrayBuffer[String], validPaths: ArrayBuffer[ArrayBuffer[String]]) : Unit = {

  val currNode = currentPath.last
  val interestingPaths = paths.filter(path => path(0) == currNode || path(1) == currNode)
/*   print("currNode: ")
  println(currNode)
  print("clonedCurrentPath: ")
  println(clonedCurrentPath)
  print("interestingPaths: ")
  interestingPaths.foreach(e=>println(e.mkString(", "))) */
  interestingPaths.foreach(path => {
    val clonedCurrentPath: ArrayBuffer[String]  = currentPath.clone()

    val source = if(path(0) == currNode) path(0) else path(1)
    val destination = if(path(0) == currNode) path(1) else path(0)

    if(destination == "start") {}
    else if(destination == "end") {
      clonedCurrentPath.append("end")
      validPaths.append(clonedCurrentPath)
    }
    else {
      if(destination.toUpperCase() == destination) {
        clonedCurrentPath.append(destination)
        addPaths(paths, clonedCurrentPath, validPaths)
      }
      else {
        var noSmallCaseDuplicates = true
        clonedCurrentPath.filter(step => step.toLowerCase() == step).foreach(step => {
          var sameSteps = 0;
          clonedCurrentPath.foreach(otherStep => {
            if(otherStep == step) sameSteps+=1
          })
          if(sameSteps > 1 && destination != "end") noSmallCaseDuplicates = false
        })
        if(noSmallCaseDuplicates || !clonedCurrentPath.contains(destination)) {
          clonedCurrentPath.append(destination)
          addPaths(paths, clonedCurrentPath, validPaths)
        }
      }
    }
  })
}


def main(args: Array[String]) = {
  val paths = scala.io.Source.fromFile("a12.txt").mkString.split("\r\n").map(_.split("-"))

  val validPaths = ArrayBuffer[ArrayBuffer[String]]();
  val currentPath = ArrayBuffer[String]("start")

  addPaths(paths, currentPath, validPaths)
  println(validPaths.length)
}