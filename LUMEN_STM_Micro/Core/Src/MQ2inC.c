#include "MQ2inC.h"
#include "stm32l4xx_hal.h"
#include "math.h"

float LPGCurve[3] = {2.3, 0.21, -0.47};
float COCurve[3] = {2.3, 0.72, -0.34};
float SmokeCurve[3] = {2.3, 0.53, -0.44};
float Ro = -1.0;
int lastReadTime = 0;
float values[3] = {0.0 , 0.0, 0.0};

void begin(ADC_HandleTypeDef *hadc){
	Ro = MQCalibration(hadc);
	/*Serial.print("Ro: ");
	Serial.print(Ro);
	Serial.println(" kohm");*/
}

void close(){
	Ro = -1.0;
	values[0] = 0.0;
	values[1] = 0.0;
	values[2] = 0.0;
}

bool checkCalibration(){
	if (Ro < 0.0) {
			//Serial.println("Device not calibrated, call MQ2::begin before reading any value.");
			return false;
		}

		return true;
}

float* read(bool print, ADC_HandleTypeDef *hadc){
	if (!checkCalibration()) return NULL;

		values[0] = MQGetPercentage(LPGCurve,hadc);
		values[1] = MQGetPercentage(COCurve, hadc);
		values[2] = MQGetPercentage(SmokeCurve, hadc);

		//lastReadTime = millis();
	    return values;
}

float readLPG(ADC_HandleTypeDef *hadc){
	if (!checkCalibration()) return 0.0;

	/*if (millis() < (lastReadTime + READ_DELAY) && values[0] > 0)
	        return values[0];
	else*/
	return (values[0] = MQGetPercentage(LPGCurve, hadc));
}

float readCO(ADC_HandleTypeDef *hadc){
	if (!checkCalibration()) return 0.0;

	/*if (millis() < (lastReadTime + READ_DELAY) && values[1] > 0)
	        return values[1];
	else*/
	return (values[1] = MQGetPercentage(COCurve, hadc));
}

float readSmoke(ADC_HandleTypeDef *hadc){
	if (!checkCalibration()) return 0.0;

	/*if (millis() < (lastReadTime + READ_DELAY) && values[2] > 0)
	        return values[2];
	else*/
	return (values[2] = MQGetPercentage(SmokeCurve, hadc));
}

float MQResistanceCalculation(int raw_adc){
	float flt_adc = (float) raw_adc;
    return RL_VALUE * (1023.0 - flt_adc) / flt_adc;
}

float MQCalibration(ADC_HandleTypeDef *hadc) {
	float val = 0.0;

	// take multiple samples
	for (int i = 0; i < CALIBARAION_SAMPLE_TIMES; i++) {
		HAL_ADC_Start(hadc);
		HAL_ADC_PollForConversion(hadc, 100);
		val += MQResistanceCalculation(HAL_ADC_GetValue(hadc));
		HAL_ADC_Stop(hadc);
		HAL_Delay(CALIBRATION_SAMPLE_INTERVAL);
	}

	//calculate the average value
	val = val / ((float) CALIBARAION_SAMPLE_TIMES);

	//divided by RO_CLEAN_AIR_FACTOR yields the Ro according to the chart in the datasheet
	val = val / RO_CLEAN_AIR_FACTOR;

	return val;
}

float MQRead(ADC_HandleTypeDef *hadc){
	float rs = 0.0;

	for (int i = 0; i < READ_SAMPLE_TIMES; i++) {
		HAL_ADC_Start(hadc);
		HAL_ADC_PollForConversion(hadc, 100);
		rs += MQResistanceCalculation(HAL_ADC_GetValue(hadc));
		HAL_ADC_Stop(hadc);
		HAL_Delay(READ_SAMPLE_INTERVAL);

	}

	return rs / ((float) READ_SAMPLE_TIMES);  // return the average
}

float MQGetPercentage(float *pcurve, ADC_HandleTypeDef *hadc){
	float rs_ro_ratio = MQRead(hadc) / Ro;
    return pow(10.0, ((log(rs_ro_ratio) - pcurve[1]) / pcurve[2]) + pcurve[0]);
}
