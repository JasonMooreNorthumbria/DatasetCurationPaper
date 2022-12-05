import cv2
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras import layers
from tensorflow.keras.optimizers import RMSprop
from skimage.transform import resize
import matplotlib.pyplot as plt
import numpy as np
import pathlib

base_model = InceptionV3(input_shape=(300, 300, 3), include_top=False, weights="imagenet")

for layer in base_model.layers:
    layer.trainable = False

x = layers.Flatten()(base_model.output)
x = layers.Dense(1024, activation="relu")(x)
x = layers.Dropout(0.2)(x)
x = layers.Dense(1, activation="sigmoid")(x)

model = tf.keras.models.Model(base_model.input, x)
model.load_weights("%s/Environment_Weights.h5" % pathlib.Path(__file__).parent.absolute())

def testEnvironmentModel(image):
    labels = ["Indoor", "Outdoor"]
    img = plt.imread(image)
    img_resized = resize(img, (300, 300, 3))
    img_resized = img_resized.astype('float32')
    pred = model.predict(np.array([img_resized]))

    return "Outdoor" if pred[0][0] > 0.5 else "Indoor"