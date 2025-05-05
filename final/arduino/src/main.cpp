#include <Arduino.h>

const int JOYX_PIN = A0;
const int JOYY_PIN = A1;
const int SW_PIN = 2;
const int LED0_PIN = 12;
const int LED1_PIN = 8;
const int LED2_PIN = 7;

const int NUM_READINGS = 10;

int direction = 0;

void setup() {
  Serial.begin(9600);

  pinMode(LED0_PIN, OUTPUT);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(SW_PIN, INPUT_PULLUP);
}

void loop() {
  double xValue = analogRead(JOYX_PIN) - 512;

  if (Serial.available() > 0) {
    String msg = Serial.readStringUntil('\n');
    
    if (msg == "3") {
      digitalWrite(LED0_PIN, HIGH);
      digitalWrite(LED1_PIN, HIGH);
      digitalWrite(LED2_PIN, HIGH);
    } else if (msg == "2") {
      digitalWrite(LED0_PIN, HIGH);
      digitalWrite(LED1_PIN, HIGH);
      digitalWrite(LED2_PIN, LOW);
    } else if (msg == "1") {
      digitalWrite(LED0_PIN, HIGH);
      digitalWrite(LED1_PIN, LOW);
      digitalWrite(LED2_PIN, LOW);
    } else if (msg == "0") {
      digitalWrite(LED0_PIN, LOW);
      digitalWrite(LED1_PIN, LOW);
      digitalWrite(LED2_PIN, LOW);
    }
  }

  int dir = xValue < -50 ? -1 : xValue > 50 ? 1 : 0;
  if (direction != dir) {
    direction = dir;
    Serial.print("d");
    Serial.println(dir);
  }

  delay(16);
}
