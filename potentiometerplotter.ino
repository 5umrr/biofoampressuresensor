// Constants:
const int potPin = A0; // pin A0 to read analog input
const int numReadings = 2; // Number of readings to average

// Variables:
int readings[numReadings]; // Array to store readings
int readIndex = 0; // Current reading index
int total = 0; // Running total
int average = 0; // Average value

void setup() {
  // Initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  
  // Initialize the readings array to 0:
  for (int i = 0; i < numReadings; i++) {
    readings[i] = 0;
  }
}

void loop() {
  // Subtract the last reading:
  total = total - readings[readIndex];

  // Read the current value from the potentiometer:
  readings[readIndex] = analogRead(potPin);

  // Add the reading to the total:
  total = total + readings[readIndex];

  // Advance to the next position in the array:
  readIndex = readIndex + 1;

  // If we're at the end of the array, wrap around to the beginning:
  if (readIndex >= numReadings) {
    readIndex = 0;
  }

  // Calculate the average:
  average = total / numReadings;

  // Print the average value to the Serial Monitor:
  Serial.println(average);

  // Small delay for stability:
  delay(100);
}
