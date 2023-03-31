import numpy as np
import pandas as pd
from hmmlearn.hmm import GaussianHMM
import pickle

# Load the trained model from the file
with open("trained_hmm_model.pkl", "rb") as f:
    model = pickle.load(f)

# Test the model using a subset of the test data
subset_pct = 0.8
correct_predictions = 0
total_predictions = 0

for stock_data in test_dfs:
    subset_size = int(len(stock_data) * subset_pct)
    subset_data = stock_data[:subset_size]

    # Predict the hidden state sequence for the subset of test data
    hidden_states = model.predict(subset_data)

    # Predict the next hidden state based on the last hidden state in the subset
    last_hidden_state = hidden_states[-1]
    next_hidden_state_proba = model.transmat_[last_hidden_state]
    next_hidden_state = np.argmax(next_hidden_state_proba)

    # Predict the next percentage price change based on the next hidden state
    predicted_pct_change = model.means_[next_hidden_state][0]

    # Compare the prediction with the actual percentage price change
    actual_pct_change = stock_data[subset_size][0]
    if np.sign(predicted_pct_change) == np.sign(actual_pct_change):
        correct_predictions += 1

    total_predictions += 1

# Calculate the prediction accuracy
accuracy = correct_predictions / total_predictions
print(f"Prediction accuracy: {accuracy:.2f}")
