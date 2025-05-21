/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.h
  * @brief          : Header for main.c file.
  *                   This file contains the common defines of the application.
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2025 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* USER CODE END Header */

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __MAIN_H
#define __MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32l4xx_hal.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */

/* USER CODE END Includes */

/* Exported types ------------------------------------------------------------*/
/* USER CODE BEGIN ET */

/* USER CODE END ET */

/* Exported constants --------------------------------------------------------*/
/* USER CODE BEGIN EC */

/* USER CODE END EC */

/* Exported macro ------------------------------------------------------------*/
/* USER CODE BEGIN EM */

/* USER CODE END EM */

void HAL_TIM_MspPostInit(TIM_HandleTypeDef *htim);

/* Exported functions prototypes ---------------------------------------------*/
void Error_Handler(void);

/* USER CODE BEGIN EFP */

/* USER CODE END EFP */

/* Private defines -----------------------------------------------------------*/
#define B1_Pin GPIO_PIN_13
#define B1_GPIO_Port GPIOC
#define B1_EXTI_IRQn EXTI15_10_IRQn
#define IMU_SCL_Pin GPIO_PIN_0
#define IMU_SCL_GPIO_Port GPIOC
#define IMU_SDA_Pin GPIO_PIN_1
#define IMU_SDA_GPIO_Port GPIOC
#define BAT_FULL_Pin GPIO_PIN_2
#define BAT_FULL_GPIO_Port GPIOC
#define USART_TX_Pin GPIO_PIN_2
#define USART_TX_GPIO_Port GPIOA
#define USART_RX_Pin GPIO_PIN_3
#define USART_RX_GPIO_Port GPIOA
#define LD2_Pin GPIO_PIN_5
#define LD2_GPIO_Port GPIOA
#define FSR_Pin GPIO_PIN_4
#define FSR_GPIO_Port GPIOC
#define BAT_SENSE_Pin GPIO_PIN_5
#define BAT_SENSE_GPIO_Port GPIOC
#define GAS_ADC_Pin GPIO_PIN_1
#define GAS_ADC_GPIO_Port GPIOB
#define GAS_D_Pin GPIO_PIN_2
#define GAS_D_GPIO_Port GPIOB
#define TEMP_SCL_Pin GPIO_PIN_10
#define TEMP_SCL_GPIO_Port GPIOB
#define TEMP_SDA_Pin GPIO_PIN_11
#define TEMP_SDA_GPIO_Port GPIOB
#define LED_PWM_Pin GPIO_PIN_13
#define LED_PWM_GPIO_Port GPIOB
#define BOOST_ENABLE_Pin GPIO_PIN_14
#define BOOST_ENABLE_GPIO_Port GPIOB
#define WK_RX_Pin GPIO_PIN_9
#define WK_RX_GPIO_Port GPIOA
#define WK_TX_Pin GPIO_PIN_10
#define WK_TX_GPIO_Port GPIOA
#define TMS_Pin GPIO_PIN_13
#define TMS_GPIO_Port GPIOA
#define TCK_Pin GPIO_PIN_14
#define TCK_GPIO_Port GPIOA
#define BAT_LOW_Pin GPIO_PIN_15
#define BAT_LOW_GPIO_Port GPIOA
#define NET_ESP_RX_Pin GPIO_PIN_10
#define NET_ESP_RX_GPIO_Port GPIOC
#define NET_ESP_TX_Pin GPIO_PIN_11
#define NET_ESP_TX_GPIO_Port GPIOC
#define GPS_RX_Pin GPIO_PIN_12
#define GPS_RX_GPIO_Port GPIOC
#define GPS_TX_Pin GPIO_PIN_2
#define GPS_TX_GPIO_Port GPIOD
#define SWO_Pin GPIO_PIN_3
#define SWO_GPIO_Port GPIOB

/* USER CODE BEGIN Private defines */

/* USER CODE END Private defines */

#ifdef __cplusplus
}
#endif

#endif /* __MAIN_H */
