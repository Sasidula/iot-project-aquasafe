# Re-import libraries after code execution state reset
import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples to generate
num_samples = 1500

# Weather condition categories
weather_conditions = {
    "Clear": 0,
    "Partly cloudy": 1,
    "Light rain": 2,
    "Heavy rain": 3,
    "Thunderstorm": 4
}

# Helper function to simulate "safe" label
def is_safe(row):
    if row["turbidity"] > 40 or row["rainfall"] > 20 or row["depth"] > 3.5 or row["current"] > 1.5:
        return 0
    if row["wind_speed"] > 30 or row["gust_speed"] > 40:
        return 0
    if row["humidity"] > 95 and row["condition"] >= 3:
        return 0
    return 1

# Helper function to derive safety level
def safety_level(row):
    if row["safe"] == 1:
        if row["current"] > 1.2 or row["turbidity"] > 30:
            return "Moderate"
        return "Safe"
    else:
        if row["turbidity"] > 60 or row["current"] > 1.8:
            return "Danger"
        return "Moderate"

# Helper function to generate safety message
def safety_message(row):
    if row["safe"] == 1:
        if row["current"] > 1.2:
            return "Use caution – moderate flow rates in effect"
        return "Conditions are safe for swimming"
    else:
        if row["turbidity"] > 60:
            return "Do not swim – high turbidity detected"
        elif row["rainfall"] > 20:
            return "Recent heavy rain – unsafe swimming conditions"
        else:
            return "Swimming not advised due to weather conditions"

# Generate synthetic dataset
data = []

for _ in range(num_samples):
    depth = round(np.random.uniform(0.5, 4.5), 2)
    current = round(np.random.uniform(0.1, 2.0), 2)
    temp = round(np.random.uniform(20, 34), 1)  # water temp
    air_temp = temp + round(np.random.uniform(0, 5), 1)
    turbidity = np.random.randint(5, 70)
    rainfall = round(np.random.exponential(scale=5), 1)
    wind_speed = round(np.random.uniform(0, 35), 1)
    gust_speed = wind_speed + round(np.random.uniform(0, 10), 1)
    humidity = np.random.randint(60, 100)
    cloud = np.random.randint(0, 100)
    feels_like = air_temp + round(np.random.uniform(0, 4), 1)
    dew_point = round(air_temp - np.random.uniform(2, 6), 1)
    uv_index = np.random.randint(0, 11)
    is_night = np.random.choice([0, 1])
    condition = np.random.choice(list(weather_conditions.values()), p=[0.3, 0.3, 0.2, 0.15, 0.05])

    row = {
        "depth": depth,
        "current": current,
        "temp": temp,
        "air_temp": air_temp,
        "turbidity": turbidity,
        "rainfall": rainfall,
        "wind_speed": wind_speed,
        "gust_speed": gust_speed,
        "humidity": humidity,
        "cloud": cloud,
        "feels_like": feels_like,
        "dew_point": dew_point,
        "uv_index": uv_index,
        "is_night": is_night,
        "condition": condition
    }

    row["safe"] = is_safe(row)
    row["safety_level"] = safety_level(row)
    row["message"] = safety_message(row)

    data.append(row)

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
csv_path = "/Users/Sasidula/Documents/nibm/iot-project-aquasafe/model/dataset.csv"
df.to_csv(csv_path, index=False)

csv_path

