#include <Arduino.h>

const int JOYX_PIN = A0;
const int JOYY_PIN = A1;
const int SW_PIN = 2;
const int LED_PIN = 12;
const int BUTTON_PIN = 5;

const int NUM_READINGS = 10;

int lightTicks = 0;
int xDirection = 0;
int yDirection = 0;

bool buttonHeld = false;

void setup() {
  Serial.begin(9600);

  pinMode(LED_PIN, OUTPUT);
  pinMode(SW_PIN, INPUT_PULLUP);
  pinMode(BUTTON_PIN, INPUT);
}

void loop() {
  double xValue = analogRead(JOYX_PIN) - 512;
  double yValue = analogRead(JOYY_PIN) - 512;

  if (lightTicks > 0) {
    lightTicks--;
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  if (Serial.available() > 0) {
    String msg = Serial.readStringUntil('\n');
    if (msg == "light") {
      lightTicks = 40;
      digitalWrite(LED_PIN, HIGH);
    }
  }

  if (abs(xValue) < 50) xValue = 0;
  if (abs(yValue) < 50) yValue = 0;

  double magn = sqrt(xValue*xValue + yValue*yValue);
  if (magn > 0) {
    xValue /= magn;
    yValue /= magn;
  }

  Serial.print("d");
  Serial.print(xValue);
  Serial.print(",");
  Serial.println(yValue);

  if (digitalRead(BUTTON_PIN) == HIGH) {
    if (!buttonHeld) {
      Serial.println("s");
      buttonHeld = true;
    }
  } else {
    buttonHeld = false;
  }

  delay(16);
}
