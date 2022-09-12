

const serviceUuid = "00001523-1212-efde-1523-785feabcd123";
const characteristicsUUID = {
  button: "00001524-1212-efde-1523-785feabcd123",
  led: "00001525-1212-efde-1523-785feabcd123",
};
let buttonCharacteristic;
let ledCharacteristic;
let buttonValue = 0;
let myBLE;

function setup() {
  myBLE = new p5ble();

  document.getElementById("myLabel").innerHTML = "Button is released!";

  const connectButton = createButton("Connect");
  connectButton.position(34, 10);
  connectButton.mousePressed(connect);

  const ledOnButton = createButton("led on");
  ledOnButton.position(9, 50);
  ledOnButton.mousePressed(ledOn);

  const ledOffButton = createButton("led off");
  ledOffButton.position(75, 50);
  ledOffButton.mousePressed(ledOff);
}

function connect() {
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  if (error) console.log("error: ", error);
  console.log(characteristics[1].uuid);
  for (let i = 0; i < characteristics.length; i++) {
    if (characteristics[i].uuid == characteristicsUUID.button) {
      buttonCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonCharacteristic, handleButton);
    } else if (characteristics[i].uuid == characteristicsUUID.led) {
      ledCharacteristic = characteristics[i];
      myBLE.startNotifications(ledCharacteristic, ledOn);
    } else {
      console.log("nothing");
    }
  }
}

function handleButton(data) {
  console.log("data: ", data);
  buttonValue = Number(data);
  if (buttonValue == "1") {
    document.getElementById("myLabel").innerHTML = "Button is pressed!";
  } else if (buttonValue == "0") {
    document.getElementById("myLabel").innerHTML = "Button is released!";
  }
}

function ledOn(data) {
  console.log("data: ", data);
  myBLE.write(ledCharacteristic, 0x01);
}

function ledOff(data) {
  console.log("data: ", data);
  myBLE.write(ledCharacteristic, 0x00);
}