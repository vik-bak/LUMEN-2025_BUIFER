#include <Arduino.h>
#include "Application.h"

//Define pins for Serial 2 UART
#define SERIAL2_RX_PIN 25
#define SERIAL2_TX_PIN 33
#define SERIAL2_BAUD_RATE 9600


// our application
Application *application;

void setup()
{
  Serial.begin(115200);
  Serial2.begin(SERIAL2_BAUD_RATE, SERIAL_8N1, SERIAL2_RX_PIN, SERIAL2_TX_PIN);
  // start up the application
  application = new Application();
  application->begin();
  Serial.println("Application started");
}

void loop()
{
  // nothing to do - the application is doing all the work
    if (Serial2.available()) {
      String input = Serial2.readStringUntil('\n');
      input.trim(); // Remove any trailing whitespace or newline characters
      Serial.print("From PuTTY: ");
      Serial.println(input);
      Serial2.print("Echo: ");
      Serial2.println(input);
      }

  vTaskDelay(pdMS_TO_TICKS(1000));
  //Check if this thread is executing (it is)
  //Serial.println("Im here MF");
}
