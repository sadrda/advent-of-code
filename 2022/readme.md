F=a03 && touch $F.txt && cp template.js $F.js && sed -i '' -e "s/aXX/$F/g" $F.js
