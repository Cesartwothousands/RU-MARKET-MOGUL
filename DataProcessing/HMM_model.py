import numpy as np
import pandas as pd
from hmmlearn import hmm
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import pickle

# Load processed data
data = pd.read_csv('DataProcessing\processed_stock_data.csv')

# Remove rows with Volume equal to 0
data = data[data['Volume'] != 0]

# Remove rows containing NaN values
data = data.dropna()

# Remove rows containing infinite values
numeric_columns = data.select_dtypes(include=[np.number]).columns
for column in numeric_columns:
    if np.isinf(data[column]).any():
        data = data[~np.isinf(data[column])]

# Remove rows where the first three attributes are all 0
data = data[~((data['Close-Open/Open'] == 0) &
              (data['High-Open/Open'] == 0) & (data['Open-Low/Open'] == 0))]

# Take absolute values for 'High-Open/Open' and 'Open-Low/Open' columns
data['High-Open/Open'] = data['High-Open/Open'].abs()
data['Open-Low/Open'] = data['Open-Low/Open'].abs()

# Standardize the data
scaler = StandardScaler()
data[['Close-Open/Open', 'High-Open/Open', 'Open-Low/Open', 'Volume']
     ] = scaler.fit_transform(data[['Close-Open/Open', 'High-Open/Open', 'Open-Low/Open', 'Volume']])

# Convert the 'Date' column to a datetime object
data['Date'] = pd.to_datetime(data['Date'])

# Sort the dataset by the 'Date' column
data = data.sort_values(by='Date')

# Reset the index of the DataFrame
data.reset_index(drop=True, inplace=True)

# Prepare the dataset
X = data[['Close-Open/Open', 'High-Open/Open', 'Open-Low/Open', 'Volume']].values

# Split the dataset into training and validation sets
train_ratio = 0.7
train_size = int(len(X) * train_ratio)
X_train, X_val = X[:train_size], X[train_size:]

n_states = 2

model = hmm.GaussianHMM(n_components=n_states,
                        covariance_type="diag", n_iter=1000000000000)
model.fit(X_train)

hidden_states_val = model.predict(X_val)

mse = mean_squared_error(X_val[:, 0], hidden_states_val)

print(f"Mean squared error: {mse}")

'''# Save the trained model to a file
with open("hmm_model.pkl", "wb") as file:
    pickle.dump(model, file)
'''

'''
2,0.8:Mean squared error: 0.9982074311529583
2,0.7:Mean squared error: 0.01827952881012519
'''
