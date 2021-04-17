import numpy as np
from keras import preprocessing
import tensorflow as tf
import pickle
import sys
from flask import Flask
from flask_restful import Api, Resource, reqparse
import os

def load_external():
    # load tokenizer
    with open('../mldata/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
    # Load model       
    model = tf.keras.models.load_model('../mldata/model')

    return model, tokenizer

def get_status():
    if os.path.exists('../mldata/model') and os.path.exists('../mldata/tokenizer.pickle'):
        return "Model exists"
    else:
        return "Model does not exist"

APP = Flask(__name__)
API = Api(APP)

class Predict(Resource):
    @staticmethod
    def post():
        global model, tokenizer
        parser = reqparse.RequestParser()
        parser.add_argument('text')
        args = parser.parse_args()

        # Pad data and preprocess it
        data = preprocessing.sequence.pad_sequences(tokenizer.texts_to_sequences([args["text"]]), maxlen=20)
        # Predict using model
        result = model.predict(np.array(data))[0][0]

        out = {'Prediction': str(result)}
        return out, 200

class Reload(Resource):
    @staticmethod
    def post():
        global model, tokenizer
        parser = reqparse.RequestParser()
        parser.add_argument('text')
        args = parser.parse_args()

        model, tokenizer = load_external()

        out = {'Message': 'Loaded the model again.'}
        return out, 200

class Status(Resource):
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('text')
        args = parser.parse_args()

        status = get_status()

        out = {'Message': status}
        return out, 200

API.add_resource(Predict, '/predict')
API.add_resource(Reload, '/reload')
API.add_resource(Status, '/status')

if __name__ == '__main__':  
    try:
        model, tokenizer = load_external()
    except:
        model, tokenizer = None, None
    APP.run(debug=False, port='3003', host='0.0.0.0')