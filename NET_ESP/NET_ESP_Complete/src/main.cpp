#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
//#include <FirebaseClient.h>
#include "driver/gpio.h"
#include "esp_camera.h"
#include "soc/rtc_cntl_reg.h" // Disable brownout problems
#include "driver/rtc_io.h"
#include <LittleFS.h>
#include <FS.h>
#include <Firebase_ESP_Client.h>
// Provide the token generation process info.
#include <addons/TokenHelper.h>
#include "Arducam_Mega.h"
#include <sys/time.h>


#define WIFI_SSID "mihaNetwork"             //WiFi credentials for phone hotspot to connect ESP to net
#define WIFI_PASSWORD "uhms9878"


#define Web_API_KEY "AIzaSyDleCwr2Yf0GMV6kfq52yU1A5x8DI3JvEA"  //Firebase project API

#define DATABASE_URL "https://arducambase-default-rtdb.europe-west1.firebasedatabase.app/"  //Database URL

#define USER_EMAIL "mihakarlo@gmail.com"    //Email and Password of the user in firebase project
#define USER_PASS "miha123"

#define STORAGE_BUCKET_ID "arducambase.firebasestorage.app"

#define FILE_PHOTO "/photo.jpg"

#define BUCKET_PHOTO "/data/photo.jpg"

#define FILE_PHOTO_PATH "/photo.jpg"


#define MAX_IMAGE_SIZE 65536   //provjerit dali dalje radi cam acqusition

CAM_IMAGE_MODE imageMode = CAM_IMAGE_MODE_SVGA;

const int CS = 5;
Arducam_Mega myCAM(CS);

boolean takeNewPhoto = true;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig configF;

bool taskCompleted = false;
bool flagReceived = false;
bool sendingPicture = false;
size_t imageSize = 0;

uint8_t imageBuffer[MAX_IMAGE_SIZE];

//UserAuth user_auth(Web_API_KEY, USER_EMAIL, USER_PASS);    //Creates Authentication Object

//FirebaseApp app;        //Creates Firebase App object

//WiFiClientSecure ssl_client;  //Creates SSl client for authentication and secure connection
//using AsyncClient = AsyncClientClass;   //Asynchronous client
//AsyncClient aClient(ssl_client);    //Instanticiating asynchronous client

//RealtimeDatabase Database;   //Realtime database object
//Storage stor;

const char *ssid = "mihaNetwork";
const char *charpassword = "uhms9878";

#define TXD1 25          //UART for connecting STM32 to ESP for receieving sensor data
#define RXD1 26

#define BUTTON_GPIO GPIO_NUM_32

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

//void processData(AsyncResult &aResult);
void IRAM_ATTR gpio_isr_handler(void* arg);
void fcsUploadCallback(FCS_UploadStatusInfo info);
void capturePhotoSaveLittleFS(void);

void captureCallbackFunction(void)
{
  myCAM.takePicture(imageMode, CAM_IMAGE_PIX_FMT_JPG);
  capturePhotoSaveLittleFS();
}

void capturePhotoSaveLittleFS(void)
{
  imageSize = 0;
  bool isCapturing = false;
  uint8_t temp = 0, temp_last = 0;

  Serial.println("Starting image capture...");

  // Read the image data from the camera
  while (myCAM.getReceivedLength())
  {
    temp_last = temp;
    temp = myCAM.readByte();

    // Detect start of JPEG
    if (temp_last == 0xFF && temp == 0xD8)
    {
      Serial.println("Found start of JPEG");
      isCapturing = true;

      // Store the header bytes
      imageBuffer[imageSize++] = temp_last;
      imageBuffer[imageSize++] = temp;
      continue;
    }

    // If we're capturing, store the byte
    if (isCapturing)
    {
      imageBuffer[imageSize++] = temp;

      // Check if we've reached the end of the JPEG
      if (temp_last == 0xFF && temp == 0xD9)
      {
        Serial.println("Found end of JPEG");
        Serial.print("Image size: ");
        Serial.println(imageSize);
        break;
      }

      // Safety check to prevent buffer overflow
      if (imageSize >= MAX_IMAGE_SIZE - 1)
      {
        Serial.println("WARNING: Image buffer full!");
        break;
      }
    }
  }

  // If we captured a valid image (has start and end markers)
  if (imageSize > 0)
  {
    Serial.printf("Picture file name: %s\n", FILE_PHOTO_PATH);
    File file = LittleFS.open(FILE_PHOTO, FILE_WRITE);
    if (!file)
    {
      Serial.println("Failed to open file in writing mode");
    }
    else
    {
      file.write(imageBuffer ,imageSize); // payload (image), payload length
      Serial.print("The picture has been saved in ");
      Serial.print(FILE_PHOTO_PATH);
      Serial.print(" - Size: ");
      Serial.print(imageSize);
      Serial.println(" bytes");
    }
    file.close();
}
}

void initLittleFS()
{
  if (!LittleFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting LittleFS");
    ESP.restart();
  }
  else
  {
    //delay(500);
    Serial.println("LittleFS mounted successfully");
  }
}



void setup() {

  // put your setup code here, to run once:
  Serial.begin(115200);
  mySerial.begin(115200,SERIAL_8N1,RXD1,TXD1);

  if (imageBuffer == NULL)
{
  Serial.println("ERROR: PSRAM allocation failed!");
  while (true)
    ; // halt
}
  /*struct timeval tv;
  tv.tv_sec =   1601216683;  // enter UTC UNIX time (get it from https://www.unixtimestamp.com )
  settimeofday(&tv, NULL);
  setenv("TZ", "CET-1CEST,M3.5.0/2,M10.5.0/ 3", 1); // https://www.gnu.org/software/libc/manual/html_node/TZ-Variable.html
  tzset();*/

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);  //Connecting to WiFi
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)    {
    Serial.print(".");
    //delay(300);
  }
  Serial.println();
  initLittleFS();
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  /*gpio_set_intr_type(BUTTON_GPIO,GPIO_INTR_POSEDGE);
  gpio_install_isr_service(0);

  /* Attach the ISR to the GPIO interrupt */
  //gpio_isr_handler_add(BUTTON_GPIO, gpio_isr_handler, NULL);

    /* Enable the Interrupt */
  //gpio_intr_enable(BUTTON_GPIO);
  /*ssl_client.setInsecure();  //Configure the client
  ssl_client.setTimeout(1000);
  ssl_client.setHandshakeTimeout(5);*/
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  time_t now = 0;
  while (time(nullptr) < 100000) {
    time(&now);
  //delay(100);
  }
  setenv("TZ", "CET-1CEST,M3.5.0/2,M10.5.0/3", 1);  // Optional: Set timezone
  tzset();
  //initializeApp(aClient, app, getAuth(user_auth), processData, "🔐 authTask");  //Initialize Firebase app
  configF.api_key = Web_API_KEY;
  configF.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASS;
  Firebase.begin(&configF, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Waiting for Firebase token...");
  while (!Firebase.ready()) {
  delay(100);
  }
  Serial.println("Firebase is ready!");
  //app.getApp<RealtimeDatabase>(Database);   //Set the database object defined earlier as database for firebase app
  //Database.url(DATABASE_URL);  //Set the URL to the database
  camSemaphoreHandle = xSemaphoreCreateBinary();
  if(camSemaphoreHandle == NULL){
    Serial.println("Semaphore not created succesfully.");
  }
  xTaskCreate(acquireData,"data acquisition",8192,(void*) NULL,2,&acqHandle);
  xTaskCreatePinnedToCore(cameraTask,"camera stuff",8192,(void*) NULL, 1, &cameraHandle,0);
  gpio_pad_select_gpio(BUTTON_GPIO);
  gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
  gpio_pulldown_dis(BUTTON_GPIO);
  gpio_pullup_en(BUTTON_GPIO);
  gpio_set_intr_type(BUTTON_GPIO,GPIO_INTR_NEGEDGE);
  gpio_install_isr_service(0);

  /* Attach the ISR to the GPIO interrupt */
  gpio_isr_handler_add(BUTTON_GPIO, gpio_isr_handler, NULL);

    /* Enable the Interrupt */
  gpio_intr_enable(BUTTON_GPIO);
  
}

void loop() {
  // put your main code here, to run repeatedly:
}


void acquireData(void *pvParameters){

  for(;;){
    //app.loop();  

    /*if(!app.ready()){
      Serial.println("Firebase app not ready");
      vTaskDelay(pdMS_TO_TICKS(500));
      continue;
    }*/

  if(mySerial.available() > 0) {
    // Read data and display it
    while(taskCompleted){
      vTaskDelay(pdMS_TO_TICKS(1));
    }
    Serial.println("Dosao");
    String message = mySerial.readStringUntil('\n');
    message.trim();
    if (message == "11"){
      Serial.println("aa hit");
      char buffer[100];
      sprintf(buffer,"/hit_detected");
      Firebase.RTDB.setBool(&fbdo,buffer,true);
      flagReceived = true;
    }
    if (message == "10"){
      char buffer[100];
      sprintf(buffer,"/bat_status");
      Firebase.RTDB.setInt(&fbdo,buffer,3);
      flagReceived = true;
    }
    if (message == "20"){
      char buffer[100];
      sprintf(buffer,"/bat_status");
      Firebase.RTDB.setInt(&fbdo,buffer,2);
      flagReceived = true;
    }
    if (message == "30"){
      char buffer[100];
      sprintf(buffer,"/bat_status");
      Firebase.RTDB.setInt(&fbdo,buffer,1);
      flagReceived = true;
    }
    if (message == "50"){
      char buffer[100];
      sprintf(buffer,"/helmet_on");
      Firebase.RTDB.setBool(&fbdo,buffer,true);
      flagReceived = true;
    }
     if (message == "60"){
      char buffer[100];
      sprintf(buffer,"/helmet_on");
      Firebase.RTDB.setBool(&fbdo,buffer,false);
      flagReceived = true;
    }
    Serial.println(message);

    if(!flagReceived){
    int result = sscanf(message.c_str(),"%d %d", &sendStruct.hum, &sendStruct.temp);
    char buffer[100];
    sprintf(buffer,"/data2/%d/temp",ink);
    //Database.set<int>(aClient,buffer,sendStruct.temp,processData,"RTDB_Send_Int");
    //Firebase.RTDB.setInt(&fbdo,buffer,sendStruct.temp);
    if (Firebase.RTDB.setInt(&fbdo, buffer, sendStruct.temp)) {
      Serial.println("Data sent successfully");
      } else {
      Serial.print("Error sending data: ");
      Serial.println(fbdo.errorReason());
      }
    buffer[0] = '\0';
    sprintf(buffer,"/data2/%d/hum",ink);
    Firebase.RTDB.setInt(&fbdo,buffer,sendStruct.hum);
    time_t now;
    struct tm timeDetails;
    time(&now);
    localtime_r(&now, &timeDetails);
    Serial.println(&timeDetails, "%A, %B %d %Y %H:%M:%S");
    buffer[0] = '\0';
    sprintf(buffer,"/data2/%d/time",ink);
    char timeBuffer[40];
    sprintf(timeBuffer, "%02d:%02d:%02d", timeDetails.tm_hour, timeDetails.tm_min, timeDetails.tm_sec);
    if(Firebase.RTDB.setString(&fbdo,buffer,timeBuffer)){
      Serial.println("Data sent successfully");
      } else {
      Serial.print("Error sending data: ");
      Serial.println(fbdo.errorReason());
      }
  
    if (ink < 5){
      ink++;
      } else ink = 1;
    //xQueueSend(queueHandle,&sendStruct,portMAX_DELAY);
    }
    flagReceived = false;
  }
  vTaskDelay(pdMS_TO_TICKS(20));
  }
}

void cameraTask(void *pvParameters){

  for(;;){
      if(xSemaphoreTake(camSemaphoreHandle,portMAX_DELAY) == pdPASS){
        vTaskDelay(pdMS_TO_TICKS(200));
        char buffer[100];
        sprintf(buffer,"/new_picture");
        Firebase.RTDB.setBool(&fbdo,buffer,true);
        Serial.println("Picture taken");
        captureCallbackFunction();
        //app.loop();
        if (Firebase.ready() && !taskCompleted){
          taskCompleted = true;
    Serial.print("Uploading picture... ");

    // MIME type should be valid to avoid the download problem.
    // The file systems for flash and SD/SDMMC can be changed in FirebaseFS.h.
    if (Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID /* Firebase Storage bucket id */, FILE_PHOTO_PATH /* path to local file */, mem_storage_type_flash /* memory storage type, mem_storage_type_flash and mem_storage_type_sd */, BUCKET_PHOTO /* path of remote file stored in the bucket */, "image/jpeg" /* mime type */, fcsUploadCallback))
    {
      Serial.printf("\nDownload URL: %s\n", fbdo.downloadURL().c_str());
      taskCompleted = false;
    }
    else
    {
      Serial.println(fbdo.errorReason());
      taskCompleted = false;
    }
        }
      }
  }
}

/*void processData(AsyncResult &aResult) {
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
}*/

void fcsUploadCallback(FCS_UploadStatusInfo info)
{
  if (info.status == firebase_fcs_upload_status_init)
  {
    Serial.printf("Uploading file %s (%d) to %s\n", info.localFileName.c_str(), info.fileSize, info.remoteFileName.c_str());
  }
  else if (info.status == firebase_fcs_upload_status_upload)
  {
    Serial.printf("Uploaded %d%s, Elapsed time %d ms\n", (int)info.progress, "%", info.elapsedTime);
  }
  else if (info.status == firebase_fcs_upload_status_complete)
  {
    Serial.println("Upload completed\n");
    FileMetaInfo meta = fbdo.metaData();
    Serial.printf("Name: %s\n", meta.name.c_str());
    Serial.printf("Bucket: %s\n", meta.bucket.c_str());
    Serial.printf("contentType: %s\n", meta.contentType.c_str());
    Serial.printf("Size: %d\n", meta.size);
    Serial.printf("Generation: %lu\n", meta.generation);
    Serial.printf("Metageneration: %lu\n", meta.metageneration);
    Serial.printf("ETag: %s\n", meta.etag.c_str());
    Serial.printf("CRC32: %s\n", meta.crc32.c_str());
    Serial.printf("Tokens: %s\n", meta.downloadTokens.c_str());
    Serial.printf("Download URL: %s\n\n", fbdo.downloadURL().c_str());
  }
  else if (info.status == firebase_fcs_upload_status_error)
  {
    Serial.printf("Upload failed, %s\n", info.errorMsg.c_str());
  }
}

void IRAM_ATTR gpio_isr_handler(void* arg){
  BaseType_t task_woken = pdFALSE;
	xSemaphoreGiveFromISR(camSemaphoreHandle,&task_woken);

		  if(task_woken){
			  portYIELD_FROM_ISR(task_woken);

		  }
}