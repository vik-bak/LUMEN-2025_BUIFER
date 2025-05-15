#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include "driver/gpio.h"

#define WIFI_SSID "mihaNetwork"             //WiFi credentials for phone hotspot to connect ESP to net
#define WIFI_PASSWORD "uhms9878"

#define Web_API_KEY "AIzaSyDleCwr2Yf0GMV6kfq52yU1A5x8DI3JvEA"  //Firebase project API

#define DATABASE_URL "https://arducambase-default-rtdb.europe-west1.firebasedatabase.app/"  //Database URL

#define USER_EMAIL "mihakarlo@gmail.com"    //Email and Password of the user in firebase project
#define USER_PASS "miha123"

UserAuth user_auth(Web_API_KEY, USER_EMAIL, USER_PASS);    //Creates Authentication Object

FirebaseApp app;        //Creates Firebase App object

WiFiClientSecure ssl_client;  //Creates SSl client for authentication and secure connection
using AsyncClient = AsyncClientClass;   //Asynchronous client
AsyncClient aClient(ssl_client);    //Instanticiating asynchronous client

RealtimeDatabase Database;   //Realtime database object

#define TXD1 12          //UART for connecting STM32 to ESP for receieving sensor data
#define RXD1 13

#define BUTTON_GPIO GPIO_NUM_0

HardwareSerial mySerial(2);

typedef struct {
  int32_t temp;
  int32_t hum;
}sensorData;

sensorData sendStruct;
sensorData rcvStruct;

TaskHandle_t acqHandle;
TaskHandle_t cameraHandle;
SemaphoreHandle_t camSemaphoreHandle;

int ink = 1;
// put function declarations here:
void acquireData(void *pvParameters);
void cameraTask(void *pvParameters);

void processData(AsyncResult &aResult);
void IRAM_ATTR gpio_isr_handler(void* arg);

void setup() {

  // put your setup code here, to run once:
  Serial.begin(115200);
  mySerial.begin(115200,SERIAL_8N1,RXD1,TXD1);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);  //Connecting to WiFi
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)    {
    Serial.print(".");
    delay(300);
  }
  Serial.println();

  /*gpio_set_intr_type(BUTTON_GPIO,GPIO_INTR_POSEDGE);
  gpio_install_isr_service(0);

  /* Attach the ISR to the GPIO interrupt */
  //gpio_isr_handler_add(BUTTON_GPIO, gpio_isr_handler, NULL);

    /* Enable the Interrupt */
  //gpio_intr_enable(BUTTON_GPIO);
  ssl_client.setInsecure();  //Configure the client
  ssl_client.setTimeout(1000);
  ssl_client.setHandshakeTimeout(5);
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  while (time(nullptr) < 100000) {
  delay(100);
  }
  initializeApp(aClient, app, getAuth(user_auth), processData, "🔐 authTask");  //Initialize Firebase app
  app.getApp<RealtimeDatabase>(Database);   //Set the database object defined earlier as database for firebase app
  Database.url(DATABASE_URL);  //Set the URL to the database
  camSemaphoreHandle = xSemaphoreCreateBinary();
  if(camSemaphoreHandle == NULL){
    Serial.println("Senaphore not created succesfully.");
  }
  xTaskCreate(acquireData,"data acquisition",8192,(void*) NULL,2,&acqHandle);
  xTaskCreate(cameraTask,"camera stuff",8192,(void*) NULL, 1, &cameraHandle);
  gpio_set_intr_type(BUTTON_GPIO,GPIO_INTR_POSEDGE);
  gpio_install_isr_service(0);

  /* Attach the ISR to the GPIO interrupt */
  gpio_isr_handler_add(BUTTON_GPIO, gpio_isr_handler, NULL);

    /* Enable the Interrupt */
  gpio_intr_enable(BUTTON_GPIO);
  vTaskStartScheduler();
}

void loop() {
  // put your main code here, to run repeatedly:
}


void acquireData(void *pvParameters){

  for(;;){
    app.loop();  

    if(!app.ready()){
      Serial.println("Firebase app not ready");
      vTaskDelay(pdMS_TO_TICKS(500));
      continue;
    }

  if(mySerial.available() > 0) {
    // Read data and display it
    Serial.println("Dosao");
    String message = mySerial.readStringUntil('\n');
    Serial.println("Received: " + message);
    int result = sscanf(message.c_str(),"%d %d", &sendStruct.temp, &sendStruct.hum);
    char buffer[100];
    sprintf(buffer,"/data2/%d/temp",ink);
    Database.set<int>(aClient,buffer,sendStruct.temp,processData,"RTDB_Send_Int");
    buffer[0] = '\0';
    sprintf(buffer,"/data2/%d/hum",ink);
    Database.set<int>(aClient,buffer,sendStruct.hum,processData,"RTDB_Send_Int");
    if (ink < 5){
      ink++;
      } else ink = 1;
    //xQueueSend(queueHandle,&sendStruct,portMAX_DELAY);
  }
  vTaskDelay(pdMS_TO_TICKS(20));
  }
}

void cameraTask(void *pvParameters){

  for(;;){
      if(xSemaphoreTake(camSemaphoreHandle,portMAX_DELAY) == pdPASS){
        Serial.println("Picture taken");
      }
  }
}

void processData(AsyncResult &aResult) {
  if (!aResult.isResult())
    return;

  if (aResult.isEvent())
    Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.eventLog().message().c_str(), aResult.eventLog().code());

  if (aResult.isDebug())
    Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());

  if (aResult.isError())
    Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());

  if (aResult.available())
    Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
}

void IRAM_ATTR gpio_isr_handler(void* arg){
  BaseType_t task_woken = pdFALSE;
	xSemaphoreGiveFromISR(camSemaphoreHandle,&task_woken);

		  if(task_woken){
			  portYIELD_FROM_ISR(task_woken);

		  }
}