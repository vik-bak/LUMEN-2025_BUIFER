#pragma once

class Output;
class I2SSampler;
class Transport;
class OutputBuffer;
class IndicatorLed;
class SampleSource;
class I2SOutputWAV;
extern volatile bool isReceiving;

class Application
{
private:
  Output *m_output;
  I2SSampler *m_input;
  Transport *m_transport;
  IndicatorLed *m_indicator_led;
  OutputBuffer *m_output_buffer;
  int control = 0;

public:
  Application();
  void begin();
  void loop();
  
};
