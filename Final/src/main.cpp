#include <Arduino.h>
#include "Application.h"
#include "esp_system.h"
#include "SampleSource.h"
#include "I2SOutputWAV.h"
#include "WAVFileReader.h"
//Define pins for Serial 2 UART
#define SERIAL2_RX_PIN 25
#define SERIAL2_TX_PIN 33
#define SERIAL2_BAUD_RATE 9600
// i2s pins WAV pins
i2s_pin_config_t i2s_wav_pins = {
    .bck_io_num = GPIO_NUM_18,
    .ws_io_num = GPIO_NUM_19,
    .data_out_num = GPIO_NUM_5,
    .data_in_num = -1};

// our application
Application *application;
//Added a semaphore to control the access to the serial port
SemaphoreHandle_t xSemaphoreMain = NULL; // Create semaphore handle
SampleSource *wav_sample_battery_low;
SampleSource *wav_sample_power_on;
SampleSource *wav_sample_toxic_gas;
SampleSource *wav_sample_high_temeperature;

I2SOutputWAV *wav_output_battery_low;
I2SOutputWAV *wav_output_power_on;
I2SOutputWAV *wav_output_toxic_gas;
I2SOutputWAV *wav_output_high_temeperature;


File m_file;
QueueHandle_t counterQueue = NULL;
QueueHandle_t passQueue = NULL;
QueueHandle_t soundQueue = NULL;
void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
    //Adeed pointers
  Serial.println("Starting up");

  SPIFFS.begin();

  Serial.println("Created sample source");
  wav_sample_battery_low = new WAVFileReader("/battery_low.wav");
  wav_sample_power_on = new WAVFileReader("/power_on.wav");
  wav_sample_toxic_gas = new WAVFileReader("/toxic_gas.wav");
  wav_sample_high_temeperature = new WAVFileReader("/high_temperature.wav");



  wav_output_battery_low = new I2SOutputWAV();
  wav_output_power_on = new I2SOutputWAV();
  wav_output_toxic_gas = new I2SOutputWAV();
  wav_output_high_temeperature = new I2SOutputWAV();
  
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
  //Create a queue to hold the counter value
  counterQueue = xQueueCreate(10, sizeof(int));
  passQueue = xQueueCreate(10, sizeof(int));
  soundQueue = xQueueCreate(10, sizeof(int));
  if (counterQueue == NULL) {
    Serial.println("Failed to create queue");
  } else {
    Serial.println("Queue created successfully");
  }
  application = new Application();
  application->begin();
  Serial.println("Application started");
}

void loop()
{

  // Serial.print("Running on core: ");
  // Serial.println(xPortGetCoreID());
  // nothing to do - the application is doing all the work

    static int counter = 0;
    static int pass = 0;
    if (Serial2.available()) {
          
      String input = Serial2.readStringUntil('\n');
      input.trim(); // Remove any trailing whitespace or newline characters
      Serial.print("From PuTTY: ");
      Serial.println(input);
      Serial2.print("Echo: ");
      Serial2.println(input);

      if (input == "20") {
        counter++;
        static int battery_low = 1;
          xQueueSend(counterQueue, &counter, 5);
          xQueueSend(soundQueue, &battery_low, 5);
              wav_output_battery_low->start(I2S_NUM_1, i2s_wav_pins, wav_sample_battery_low);
      
       
       } else if (input == "40") {
        counter++;
        static int power_on = 2;
              xQueueSend(counterQueue, &counter, 5);
              xQueueSend(soundQueue, &power_on, 5);
              wav_output_power_on->start(I2S_NUM_1, i2s_wav_pins, wav_sample_power_on);

       }
       else if (input == "50") {
        counter++;
        static int toxic_gas = 3;
              xQueueSend(counterQueue, &counter, 5);
              xQueueSend(soundQueue, &toxic_gas, 5);
              wav_output_toxic_gas->start(I2S_NUM_1, i2s_wav_pins, wav_sample_toxic_gas);
       }

       else if (input == "60") {
        counter++;
        static int high_temperature = 4;
            xQueueSend(counterQueue, &counter, 5);
            xQueueSend(soundQueue, &high_temperature, 5);
              wav_output_high_temeperature->start(I2S_NUM_1, i2s_wav_pins, wav_sample_high_temeperature);
       }
      
      
    }

  

  vTaskDelay(pdMS_TO_TICKS(1000));
  //Check if this thread is executing (it is)
  //Serial.println("Im here MF");
}
