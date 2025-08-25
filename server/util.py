import json
import pickle
import numpy as np
import pandas as pd
import warnings
from sklearn.exceptions import InconsistentVersionWarning


warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bath, bhk):
    
    input_df = pd.DataFrame(np.zeros((1, len(__data_columns))), columns=__data_columns)

    input_df['total_sqft'] = sqft
    input_df['bath'] = bath
    input_df['bhk'] = bhk


    if location in input_df.columns:
        input_df[location] = 1

    return round(np.exp(__model.predict(input_df)[0]), 2)

def get_location_names():
    return __locations

def load_saved_artifacts():
    print("Loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    with open("./artifacts/bengaluru_home_prices_model.pickle", "rb") as f:
        __model = pickle.load(f)

    __data_columns = list(__model.feature_names_in_)
    __locations = __data_columns[3:]

    print("Loading saved artifacts...done")

# This will run once when the module is imported by app.py
load_saved_artifacts()

if(__name__ == "__main__"):
    # This block is for testing the module directly.
    print("Testing get_location_names():")
    print(get_location_names()[:5]) # Print first 5 locations
    print("\nTesting get_estimated_price():")
    print(get_estimated_price('1st Phase JP Nagar', 1000, 2, 2))
    print(get_estimated_price('Indira Nagar', 1000, 3, 3))

   