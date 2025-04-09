#include <Arduino.h>

const int btnPin = 3;
const int potentiometerPin = A5;
const int playerLedPin = 6;
const int goalLedPin = 9;

int value = -1;

void beginGame() {
  value = random(4, 128);
  analogWrite(goalLedPin, value);
}

void endGame() {
  value = -1;
  digitalWrite(playerLedPin, LOW);
  digitalWrite(goalLedPin, LOW);
}

void setup() {
  pinMode(btnPin, INPUT);
  pinMode(potentiometerPin, INPUT);
  pinMode(goalLedPin, OUTPUT);
}

void loop() {
  if (value == -1) {
    if (digitalRead(btnPin) == HIGH && analogRead(potentiometerPin) == 0) beginGame();
  } else {
    int potentiometerValue = analogRead(potentiometerPin) / 8;
    analogWrite(playerLedPin, potentiometerValue);
    if (potentiometerValue > value) endGame();
  }

  delay(30);
}
