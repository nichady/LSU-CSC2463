#include <Arduino.h>

const int button0Pin = 3;
const int button1Pin = 2;
const int led0Pin = 13;
const int led1Pin = 12;

int previousMillis = 0;

void setup() {
  pinMode(button0Pin, INPUT);
  pinMode(button1Pin, INPUT);
  pinMode(led0Pin, OUTPUT);
  pinMode(led1Pin, OUTPUT);
}

void loop() {
  if (digitalRead(button0Pin) == HIGH) {
    unsigned long time = millis() % 3000;
    if (time < 1000) digitalWrite(led0Pin, HIGH);
    else if (time < 1100) digitalWrite(led0Pin, HIGH);
    else if (time < 1200) digitalWrite(led0Pin, LOW);
    else if (time < 1300) digitalWrite(led0Pin, HIGH);
    else if (time < 1500) digitalWrite(led0Pin, LOW);
    else if (time < 1700) digitalWrite(led0Pin, HIGH);
    else if (time < 2500) digitalWrite(led0Pin, LOW);
    else if (time < 2600) digitalWrite(led0Pin, HIGH);

    if (time < 500) digitalWrite(led1Pin, HIGH);
    else if (time < 1600) digitalWrite(led1Pin, HIGH);
    else if (time < 1800) digitalWrite(led1Pin, LOW);
    else if (time < 1900) digitalWrite(led1Pin, HIGH);
    else if (time < 2000) digitalWrite(led1Pin, LOW);
    else if (time < 2100) digitalWrite(led1Pin, HIGH);
    else if (time < 2200) digitalWrite(led1Pin, LOW);
    else if (time < 2800) digitalWrite(led1Pin, HIGH);
    return;
  }

  if (digitalRead(button1Pin) == HIGH) {
    unsigned long time = millis() % 1000;
    if (time < 100) digitalWrite(led0Pin, HIGH);
    else if (time < 200) digitalWrite(led0Pin, HIGH);
    else if (time < 300) digitalWrite(led0Pin, LOW);
    else if (time < 400) digitalWrite(led0Pin, HIGH);
    else if (time < 500) digitalWrite(led0Pin, LOW);
    else if (time < 800) digitalWrite(led0Pin, HIGH);
    else if (time < 900) digitalWrite(led0Pin, LOW);
    else if (time < 1000) digitalWrite(led0Pin, HIGH);

    if (time < 50) digitalWrite(led1Pin, HIGH);
    else if (time < 200) digitalWrite(led1Pin, HIGH);
    else if (time < 250) digitalWrite(led1Pin, LOW);
    else if (time < 275) digitalWrite(led1Pin, HIGH);
    else if (time < 500) digitalWrite(led1Pin, LOW);
    else if (time < 900) digitalWrite(led1Pin, HIGH);
    return;
  }

  digitalWrite(led0Pin, LOW);
  digitalWrite(led1Pin, LOW);
}
