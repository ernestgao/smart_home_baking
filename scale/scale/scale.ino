/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/arduino-load-cell-hx711/
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

#include <Arduino.h>
#include "HX711.h"
#include <Pushbutton.h>

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = 2;
const int LOADCELL_SCK_PIN = 3;
HX711 scale;
float reading;
float lastReading = 0.0;

#define CALIBRATION_FACTOR 682.97587

#define BUTTON_PIN 4
Pushbutton button(BUTTON_PIN);

void setup() {
  Serial.begin(9600);
  Serial.println("Initializing the scale");
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  scale.set_scale(CALIBRATION_FACTOR);   // this value is obtained by calibrating the scale with known weights
  scale.tare();               // reset the scale to 0
}

void loop() {
  if (button.getSingleDebouncedPress()){
    Serial.println("tare...");
    scale.tare();
  }
  
  if (scale.wait_ready_timeout(200)) {
    reading = scale.get_units();
    reading = round(scale.get_units(5) * 100) / 100.0;
    if (abs(reading-lastReading) >= 0.1){
      Serial.println(reading, 1);
    }
    lastReading = reading;
  }
  else {
    Serial.println("HX711 not found.");
  }
}

