import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix

# Load the dataset
df = pd.read_csv("/Users/Sasidula/Documents/nibm/iot-project-aquasafe/model/dataset.csv")

# Encode target labels
label_encoder = LabelEncoder()
df['safety_level_encoded'] = label_encoder.fit_transform(df['safety_level'])

# Drop unnecessary columns
features = df.drop(columns=['safe', 'safety_level', 'message', 'safety_level_encoded'])
target = df['safety_level_encoded']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# XGBoost multiclass model
model = xgb.XGBClassifier(objective="multi:softmax", num_class=3, eval_metric="mlogloss", use_label_encoder=False)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)

# Decode predictions
y_test_decoded = label_encoder.inverse_transform(y_test)
y_pred_decoded = label_encoder.inverse_transform(y_pred)

# Report
print("Classification Report:\n")
print(classification_report(y_test_decoded, y_pred_decoded))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test_decoded, y_pred_decoded))
