#include <Arduino.h>

const int JOYX_PIN = A0;
const int JOYY_PIN = A1;
const int SW_PIN = 2;
const int LED_PIN = 12;

const int NUM_READINGS = 10;

bool lightOn = false;

void setup() {
  Serial.begin(9600);

  pinMode(LED_PIN, OUTPUT);
  pinMode(SW_PIN, INPUT_PULLUP);

  digitalWrite(LED_PIN, lightOn);
}

void loop() {
  int xValue = analogRead(JOYX_PIN);
  int yValue = analogRead(JOYY_PIN);
  int swValue = !digitalRead(SW_PIN);

  if (Serial.available() > 0) {
    String msg = Serial.readStringUntil('\n');
    if (msg == "light") {
      lightOn = !lightOn;
      digitalWrite(LED_PIN, lightOn);
    }
  }

  Serial.print("x");
  Serial.println(xValue);
  delay(16);
}
