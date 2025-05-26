/*
 * MQ2inC.h
 *
 *  Created on: Apr 18, 2025
 *      Author: Miha
 */
#include "stdio.h"
#include <stdbool.h>
#include "stm32l4xx_hal.h"

#ifndef INC_MQ2INC_H_
#define INC_MQ2INC_H_

#define RL_VALUE 5.0  //Load resistance on board in kilo ohms

#define RO_CLEAN_AIR_FACTOR 9.83 //given constant

// reads 10 times the sensor every 50ms and takes the average
// NOTE: it is encouraged to take more samples during the calibration
# define CALIBARAION_SAMPLE_TIMES 10
# define CALIBRATION_SAMPLE_INTERVAL 50

// reads 5 times the sensor every 50ms and takes the average
# define READ_SAMPLE_TIMES 5
# define READ_SAMPLE_INTERVAL 50

// 10s, time elapsed before new data can be read.
# define READ_DELAY 10000

		 /*
		 * Initialises the sensor before getting any data.
		 * This step is necessary as it needs to be calibrated based on
		 * current air and temperature conditions.
		 */
void begin(ADC_HandleTypeDef *hadc);
		 /*
		 * Stops the sensor, calibration and any read data is deleted.
		 */
void close();

/*
		 * Reads the LPG, CO and smoke data from the sensor and returns and
		 * array with the values in this order.
		 *
		 * The read procedure takes `READ_SAMPLE_TIMES` samples from the sensor
		 * every `READ_SAMPLE_INTERVAL` ms and returns the average.
		 *
		 * NOTE: do not modify the values of the returned array in place or deallocate it,
		 * that could have unexpected consequences. Time to PANIC.
		 */
float* read(bool print, ADC_HandleTypeDef *hadc);

/*
		 * Same as before but only return the data from the specified gas.
		 *
		 * If the time elapsed since the last measurement is smaller than
		 * `READ_DELAY`, the same prior value will be returned.
		 */
float readLPG(ADC_HandleTypeDef *hadc);
float readCO(ADC_HandleTypeDef *hadc);
float readSmoke(ADC_HandleTypeDef *hadc);

extern float LPGCurve[3];
extern float COCurve[3];
extern float SmokeCurve[3];
extern float Ro;

extern float values[3];  // array with the measured values in the order: lpg, CO and smoke

float MQRead(ADC_HandleTypeDef *hadc);
float MQGetPercentage(float *pcurve,ADC_HandleTypeDef *hadc);
float MQCalibration(ADC_HandleTypeDef *hadc);
float MQResistanceCalculation(int raw_adc);
bool checkCalibration();

extern int lastReadTime;



#endif /* INC_MQ2INC_H_ */
