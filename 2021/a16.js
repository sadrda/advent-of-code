const fs = require("fs");

const hexCode = fs.readFileSync("a16.txt").toString();
const code = hexCode
  .split("")
  .reduce(
    (acc, char) => (acc += parseInt(char, 16).toString(2).padStart(4, "0")),
    ""
  );
let index = 0;

const getPacket = () => {
  const packetType = parseInt(code.slice(index + 3, index + 6), 2);
  index += 6;

  const packet = {
    packetType,
  };
  if (packetType === 4) {
    packet.literal = getLiteralPacket();
  } else {
    packet.subPackets = getOperatorPacket();
  }
  return packet;
};

const getLiteralPacket = () => {
  let isLastGroup = false;
  let literalBinary = "";
  while (!isLastGroup) {
    const group = code.slice(index, index + 5);
    if (group[0] === "0") isLastGroup = true;
    literalBinary += group.slice(1, 5);
    index += 5;
  }
  const literal = parseInt(literalBinary, 2);
  return literal;
};

const getOperatorPacket = () => {
  const lengthTypeId = parseInt(code.slice(index, index + 1), 2);
  index++;

  const packets = [];

  if (lengthTypeId === 0) {
    const subPacketLengthIndex =
      15 + index + parseInt(code.slice(index, index + 15), 2);
    index += 15;

    while (index < subPacketLengthIndex) {
      packets.push(getPacket());
    }
  }
  if (lengthTypeId === 1) {
    const subPackets = parseInt(code.slice(index, index + 11), 2);
    index += 11;
    for (let i = 0; i < subPackets; i++) {
      packets.push(getPacket());
    }
  }
  return packets;
};

const parse = (packet) => {
  switch (packet.packetType) {
    case 0:
      return packet.subPackets.reduce((acc, curr) => acc + parse(curr), 0);
    case 1:
      return packet.subPackets.reduce((acc, curr) => acc * parse(curr), 1);
    case 2:
      return Math.min(...packet.subPackets.map((packet) => parse(packet)));
    case 3:
      return Math.max(...packet.subPackets.map((packet) => parse(packet)));
    case 4:
      return packet.literal;
    case 5:
      return parse(packet.subPackets[0]) > parse(packet.subPackets[1]) ? 1 : 0;
    case 6:
      return parse(packet.subPackets[0]) < parse(packet.subPackets[1]) ? 1 : 0;
    case 7:
      return parse(packet.subPackets[0]) === parse(packet.subPackets[1])
        ? 1
        : 0;
  }
};

const packet = getPacket();
console.log(parse(packet));
