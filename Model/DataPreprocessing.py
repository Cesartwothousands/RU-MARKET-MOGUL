import numpy as np
import pandas as pd


def DataPreprocessing():
    dfs = []
    for i in range(350):
        csv_path = f"F:/MSCS/ECE568_Web App/RU-MARKET-MOGUL/Local Dataset/All Time/train_data_csv/stock_{i}.csv"
        df = pd.read_csv(csv_path)
        # delete column symbol
        df = df.drop(columns=['Symbol'])
        diffs = np.diff(df['adjclose'])
        pct_diffs = diffs / df['adjclose'][:-1]
        pct_diffs = np.concatenate(([0], pct_diffs))

        new_df = pd.DataFrame(
            {'col1_diff': pct_diffs, 'col2': df.iloc[:, 1]})
        new_df = np.array(new_df)
        dfs.append(new_df)
    return dfs
