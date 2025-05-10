#include <Arduino.h>
#include "Application.h"
#include "esp_system.h"
//Define pins for Serial 2 UART
#define SERIAL2_RX_PIN 25
#define SERIAL2_TX_PIN 33
#define SERIAL2_BAUD_RATE 9600


// our application
Application *application;
//Added a semaphore to control the access to the serial port
SemaphoreHandle_t xSemaphoreMain = NULL; // Create semaphore handle
volatile bool isReceiving = true; // Flag to check if semaphore is created
void setup()
{
  Serial.begin(115200);
  delay(1000);
  int coreCount = ESP.getChipCores();
  Serial.print("Number of cores: ");
  Serial.println(coreCount);

  Serial2.begin(SERIAL2_BAUD_RATE, SERIAL_8N1, SERIAL2_RX_PIN, SERIAL2_TX_PIN);
  // xSemaphoreMain = xSemaphoreCreateBinary(); // Create a mutex semaphore
  //   if (xSemaphoreMain == NULL) {
  //   Serial.println("Failed to create semaphore");
  // } else {
  //   Serial.println("Semaphore created successfully");
  // }
  // xSemaphoreGive(xSemaphoreMain); // Give the semaphore to start with
  //xTaskCreatePinnedToCore()
  // start up the application
  
  application = new Application();
  application->begin();
  Serial.println("Application started");
}

void loop()
{

  // Serial.print("Running on core: ");
  // Serial.println(xPortGetCoreID());
  // nothing to do - the application is doing all the work

  
    if (Serial2.available()) {
      
      String input = Serial2.readStringUntil('\n');
      input.trim(); // Remove any trailing whitespace or newline characters
      Serial.print("From PuTTY: ");
      Serial.println(input);
      Serial2.print("Echo: ");
      Serial2.println(input);

      if (input == "20") {
        isReceiving = false; // Set the flag to stop receiving
              //Simulate some work in the high priority task
              
      for (int i = 0; i < 5000; i++) {
        Serial.print("High priority task working... ");
        Serial.println(i + 1);
      }
      isReceiving = true;
      
      }
      
    }

  

  vTaskDelay(pdMS_TO_TICKS(1000));
  //Check if this thread is executing (it is)
  //Serial.println("Im here MF");
}
