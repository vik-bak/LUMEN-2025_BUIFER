#pragma once

class Output;
class I2SSampler;
class Transport;
class OutputBuffer;
class IndicatorLed;
class SampleSource;
class I2SOutputWAV;

class Application
{
private:
  Output *m_output;
  I2SSampler *m_input;
  Transport *m_transport;
  IndicatorLed *m_indicator_led;
  OutputBuffer *m_output_buffer;
  SampleSource *wav_sample_source;
  I2SOutputWAV *wav_output;

public:
  Application();
  void begin();
  void loop();
};
