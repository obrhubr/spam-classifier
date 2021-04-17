import numpy as np
import pandas as pd
from sklearn.utils import shuffle
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras import preprocessing
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Flatten, Dense
from tensorflow.keras.layers import Embedding
import tensorflow as tf
import pickle
import os

from flask import Flask
from flask_restful import Api, Resource, reqparse
import requests

APP = Flask(__name__)
API = Api(APP)

def save_model(model, tokenizer):
    model.save('../mldata/model')
    with open('../mldata/tokenizer.pickle', 'wb') as handle:
        pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

def load_model():
    # load tokenizer
    with open('../mldata/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
    # Load model       
    model = tf.keras.models.load_model('../mldata/model')
    return model, tokenizer

def continue_training(model, tokenizer):
    global spam
    text = []
    label = []
    for s in spam.find():
        print("Found: ", s)
        text.append(s["text"])
        label.append(s["label"])
    # Use tokenizer
    sequences = tokenizer.texts_to_sequences(text)
    # Rename for convienience
    x_train = sequences
    y_train = label
    # Preprocess data
    maxlen = 20
    x_train = preprocessing.sequence.pad_sequences(x_train, maxlen=maxlen)
    history = model.fit(np.array(x_train), np.array(y_train),
                        epochs=10,
                        batch_size=32,
                        validation_split=0.2)
    return model, tokenizer

def create_model_from_scratch():
    # Read dataset from spamassassin.apache.org
    data = pd.read_csv('data/spam_or_not_spam.csv')
    # Shuffle data to improve performance
    data = shuffle(data)
    # Create list from data
    text = []
    for index, rows in data.iterrows(): 
        my_list =str(rows.email)
        text.append(my_list)
    label = list(data['label'])
    # Create tokenizer
    tokenizer = Tokenizer(num_words=1000)
    tokenizer.fit_on_texts(text)
    sequences = tokenizer.texts_to_sequences(text)
    # Rename for convienience
    x_train = sequences
    y_train = label
    # Preprocess data
    maxlen = 20
    x_train = preprocessing.sequence.pad_sequences(x_train, maxlen=maxlen)
    # Create tf model
    model = Sequential()
    model.add(Embedding(2000, 8, input_length=maxlen))
    model.add(Flatten())
    model.add(Dense(1, activation='sigmoid'))
    model.compile(optimizer='rmsprop', loss='binary_crossentropy', metrics=['acc'])
    model.summary()
    history = model.fit(np.array(x_train), np.array(y_train),
                        epochs=10,
                        batch_size=32,
                        validation_split=0.2)
    return model, tokenizer

class Retrain_scratch(Resource):
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('text')
        args = parser.parse_args()

        model, tokenizer = create_model_from_scratch()
        save_model(model, tokenizer)

        requests.post('http://ml-api:3003/reload', data = {})

        out = {'Message': 'Finished full retrain.'}
        return out, 200

class Retrain(Resource):
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('text')
        args = parser.parse_args()

        model, tokenizer = load_model()
        model, tokenizer = continue_training(model, tokenizer)
        save_model(model, tokenizer)

        requests.post('http://ml-api:3003/reload', data = {})

        out = {'Message': 'Finished training with new data'}
        return out, 200

API.add_resource(Retrain_scratch, '/retrain_scratch')
API.add_resource(Retrain, '/retrain')

if __name__ == '__main__':
    import pymongo
    user = os.getenv("MONGO_USERNAME", "")
    password = os.getenv("MONGO_PASSWORD", "")
    client = pymongo.MongoClient(f"mongodb://{user}:{password}@mongo:27017/?authSource=admin")
    db = client['spam-classifier']
    spam = db["spams"]
    # Run flask app
    APP.run(debug=False, port='3002', host='0.0.0.0')