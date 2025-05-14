#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>

#define WIFI_SSID "AsusZenfone9"             //WiFi credentials for phone hotspot to connect ESP to net
#define WIFI_PASSWORD "Pass23124"

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

HardwareSerial mySerial(2);

typedef struct {
  int32_t temp;
  int32_t hum;
}sensorData;

sensorData sendStruct;
sensorData rcvStruct;

TaskHandle_t acqHandle;
TaskHandle_t sendHandle;
//xQueueHandle queueHandle;

int ink = 1;
// put function declarations here:
void acquireData(void *pvParameters);
void sendData(void *pvParameters);
void processData(AsyncResult &aResult);

void setup() {

  // put your setup code here, to run once:
  Serial.begin(115200);
  mySerial.begin(115200,SERIAL_8N1,RXD1,TXD1);

  /*TaskHandle_t acqHandle;
  TaskHandle_t sendHandle;
  xQueueHandle queueHandle;*/

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);  //Connecting to WiFi
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)    {
    Serial.print(".");
    delay(300);
  }
  Serial.println();

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
  //queueHandle = xQueueCreate(2,sizeof(sensorData));
  xTaskCreate(acquireData,"data acquisition",8192,(void*) NULL,2,&acqHandle);
  xTaskCreate(sendData,"data sending",8192,(void*) NULL,3,&sendHandle);
  vTaskStartScheduler();
}

void loop() {
  // put your main code here, to run repeatedly:
}


void acquireData(void *pvParameters){

  for(;;){
    app.loop();  // 👈 VERY IMPORTANT, always call this in your task loop

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

void sendData(void *pvParameters){

   for(;;){
   /* app.loop();
    if(app.ready()){    

      if (xQueueReceive(queueHandle,&rcvStruct,portMAX_DELAY) == pdPASS){
      char buffer[100];
      sprintf(buffer,"/data2/%d/temp",ink);
      Serial.println(buffer);
      Database.set<int>(aClient,buffer,rcvStruct.temp,processData,"RTDB_Send_Int");
      buffer[0] = '\0';
      sprintf(buffer,"/data2/%d/hum",ink);
      Serial.println(buffer);
      Database.set<int>(aClient,buffer,rcvStruct.hum,processData,"RTDB_Send_Int");
      if (ink < 5){
      ink++;
      } else ink = 1;
      Serial.printf("Free heap: %u\n", ESP.getFreeHeap());
      Serial.println(ink);
    }
  }
    //Database.set<int>(aClient,"/test/int",5,processData,"RTDB_Send_Int");
    //Serial.printf("Free heap: %u\n", ESP.getFreeHeap());*/
    vTaskDelay(pdMS_TO_TICKS(20));
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