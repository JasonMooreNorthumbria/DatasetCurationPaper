import tensorflow as tf
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.optimizers import RMSprop
import numpy as np
import matplotlib.pyplot as plt
from skimage.transform import resize
import pathlib

base_model = InceptionV3(input_shape=(299, 299, 3), include_top=False, weights="imagenet")

for layer in base_model.layers:
    layer.trainable = False

x = Flatten()(base_model.output)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.3)(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.2)(x)
x = Dense(3, activation="softmax")(x)

model = tf.keras.models.Model(base_model.input, x)
model.load_weights("%s/FloorVisible_Outdoor_Weights.h5" % pathlib.Path(__file__).parent.absolute())

def testOutsideFloorModel(image):
    labels = ["FloorVisible", "FloorNotVisible", "Stairs"]
    img = plt.imread(image)
    img = resize(img, (299, 299, 3))
    img.astype("float32")
    pred = model.predict(np.array([img]))
    top = np.argmax(pred)

    floor = pred[0][0]
    noFloor = pred[0][1]
    stairs = pred[0][2]

    results = {
        "Max": labels[top],
        "FloorVisible": str(floor),
        "FloorNotVisible": str(noFloor),
        "Stairs": str(stairs)
    }

    return results