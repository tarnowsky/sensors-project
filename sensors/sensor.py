import time
import threading
import math
import random
import paho.mqtt.client as mqtt
from abc import ABC, abstractmethod

class Sensor(ABC):
    _id_counter = 0

    def __init__(self, sleepLowerBound=0.1, sleepUpperBound=1, broker="localhost", port=9001):
        self._sleepLowerBound = sleepLowerBound
        self._sleepUpperBound = sleepUpperBound
        Sensor._id_counter += 1
        self._id = Sensor._id_counter
        self._client = mqtt.Client()
        self._client.connect(broker, port)
        self._topic = "topic/topic"        
        
    def __del__(self):
        self._client.disconnect()

    def start(self):
        self._isRunning = True
        self._thread = threading.Thread(target=self._produceData)
        self._thread.start()

    def stop(self):
        self._isRunning = False
        if hasattr(self, "_thread") and self._thread.is_alive():
            self._thread.join()

    def generateValue(self, value):
        self._client.publish(self._topic, value)
        print("published: ", value, " to topic: ", self._topic)

    def getName(self):
        return f"{self._topic} no.: {self._id}"


    def _produceData(self):
        while self._isRunning:
            data = self._productionFunction(time.time())
            self._client.publish(self._topic, data)
            print("published: ", data, " to topic: ", self._topic)
            
            time.sleep(random.uniform(self._sleepLowerBound, self._sleepUpperBound))

    @abstractmethod
    def _productionFunction(self, t):
        pass


class TemperatureSensor(Sensor):
    def __init__(self, sleepLowerBound=1, sleepUpperBound=10, broker="localhost", port=9001):
        super().__init__(sleepLowerBound, sleepUpperBound, broker, port)
        self._topic = "TEMPERATURE"
        
    def _productionFunction(self, t):
        return math.sin(t)

class PressureSensor(Sensor):
    def __init__(self, sleepLowerBound=1, sleepUpperBound=10, broker="localhost", port=9001):
        super().__init__(sleepLowerBound, sleepUpperBound, broker, port)
        self._topic = "PRESSURE"
        
    def _productionFunction(self, t):
        return math.cos(t)

class Co2Sensor(Sensor):
    def __init__(self, sleepLowerBound=1, sleepUpperBound=10, broker="localhost", port=9001):
        super().__init__(sleepLowerBound, sleepUpperBound, broker, port)
        self._topic = "C02"
        
    def _productionFunction(self, t):
        return math.tan(t)

class DissolvedOxygenSensor(Sensor):
    def __init__(self, sleepLowerBound=1, sleepUpperBound=10, broker="localhost", port=9001):
        super().__init__(sleepLowerBound, sleepUpperBound, broker, port)
        self._topic = "DISSOLVED_OXYGEN"
        
    def _productionFunction(self, t):
        return math.cos(t) * 2
