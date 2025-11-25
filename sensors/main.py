import threading
import time
from sensor import *

def input_thread():
    global programIsRunning
    while programIsRunning:
        try:
            key = int(input())
            if key == 1:
                for sensor in all_sensors:
                    sensor.start()
                print("Sensors started")
            elif key == 2:
                for sensor in all_sensors:
                    sensor.stop()
                print("Sensors stopped")
            elif key == 3:
                for sensor in all_sensors:
                    sensor.stop()
                programIsRunning = False
                print("Exiting program...")
            elif key == 4:
                print("Select a sensor (-1 to cancel):")
                for i, sensor in enumerate(all_sensors):
                    print(f"{i}: {sensor.getName()}")
                try:
                    choice = int(input())
                    if choice == -1:
                        print("Cancelled")
                    elif 0 <= choice < len(all_sensors):
                        value = input(f"Enter value to generate for {all_sensors[choice].getName()}: ")
                        all_sensors[choice].generateValue(value)
                    else:
                        print("Invalid number")
                except ValueError:
                    print("Please enter a valid number.")
        except ValueError:
            print("Please enter a valid number.")

print("Initializing sensors")

temperatureSensors = [TemperatureSensor() for i in range(1)]
pressureSensors = [PressureSensor() for i in range(1)]
co2eSensors = [Co2Sensor() for i in range(1)]
oxygenSensors = [DissolvedOxygenSensor() for i in range(1)]

all_sensors = temperatureSensors + pressureSensors + co2eSensors + oxygenSensors

print("Press 1 to start sensors")
print("Press 2 to stop sensors")
print("Press 3 to end program")
print("Press 4 to produce specified data by specified sensor")


programIsRunning = True

threading.Thread(target=input_thread, daemon=True).start()

while programIsRunning:
    time.sleep(0.5)
