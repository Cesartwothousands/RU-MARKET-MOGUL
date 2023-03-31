import time
import numpy as np
from hmmlearn.hmm import GaussianHMM
from DataPreprocessing import DataPreprocessing
import pickle

start_time = time.time()

dfs = DataPreprocessing()
# Print time
print("--- %s seconds ---" % (time.time() - start_time))

train_data = np.vstack(dfs)
n_hidden_states = 3
n = 10000
model = GaussianHMM(n_components=n_hidden_states,
                    covariance_type="diag", n_iter=n)

model.fit(train_data)
# Print time
print("--- %s seconds ---" % (time.time() - start_time))

# Save the trained model to a file
with open(f"F:/MSCS/ECE568_Web App/RU-MARKET-MOGUL/Model/trained_hmm_model_{n_hidden_states}_{n}.pkl", "wb") as f:
    pickle.dump(model, f)
