# FitSync: AI & Digital Twin Solution for Modern Gyms

**FitSync** is an AI-powered system that enhances workout safety using **real-time heart rate monitoring**, **LSTM-based anomaly detection**, and **Digital Twin simulation**.  
It helps gym users prevent overexertion and cardiac risks by predicting and visualizing heart rate patterns live.

---

## Key Features
-  **Real-Time Heart Rate Tracking** via Arduino BPM sensor  
-  **AI Anomaly Detection** using LSTM Autoencoder  
-  **Digital Twin in MATLAB Simulink** for simulation and prediction  
-  **Web Dashboard (Node.js + MongoDB)** for live graphs and alerts  

---

## System Architecture
1. **Hardware Input:** Arduino Uno + BPM sensor  
2. **ML Model:** LSTM Autoencoder (trained on heart rate data)  
3. **Digital Twin:** MATLAB Simulink simulation with real-time prediction  
4. **Web Dashboard:** Node.js + MongoDB visualization and alerts  

---

## Tech Stack
- **AI/ML:** TensorFlow, Keras  
- **Simulation:** MATLAB Simulink  
- **Hardware:** Arduino Uno, Pulse Sensor  
- **Backend:** Node.js, MongoDB  
- **Communication:** UDP  

---

## Setup
```bash
git clone https://github.com/<your-username>/FitSync.git
cd FitSync/backend
npm install
node app.js
```
## MATLAB Simulink

### MATLAB Simulink Setup
1. Open the **`digital_twin_model.slx`** file in MATLAB Simulink.  
2. Configure **serial input** from the Arduino device.  
3. Start the **simulation** to stream real-time heart rate data.  
4. Data will be transmitted to the web dashboard via **UDP communication** for live monitoring.

---

## ML Model (Training / Testing)

### Model Execution
Run the following commands to train or test the LSTM Autoencoder model:

```bash
cd ml_model
python lstm_autoencoder.py
```
