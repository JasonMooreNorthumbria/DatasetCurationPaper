import tensorflow as tf
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.layers import Dense, Flatten, Dropout
from skimage.transform import resize
import numpy as np
import matplotlib.pyplot as plt
import pathlib

base_model = InceptionV3(input_shape = (299, 299, 3), weights="imagenet", include_top=False)

for layer in base_model.layers:
    layer.trainable = False

x = Flatten()(base_model.output)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.3)(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.2)(x)
x = Dense(3, activation="softmax")(x)

model = tf.keras.models.Model(base_model.input, x)
model.load_weights("%s/Terrain_Indoor_Weights.h5" % pathlib.Path(__file__).parent.absolute())

def testClassifyIndoorModel(image):
    labels = ["Carpet", "Tiles", "Wood"]
    img = plt.imread(image)
    img = resize(img, (299, 299, 3))
    img.astype("float32")
    pred = model.predict(np.array([img]))
    top = np.argmax(pred)

    carpet = pred[0][0]
    tiles = pred[0][1]
    wood = pred[0][2]

    results = {
        "Max": labels[top],
        "Carpet": str(carpet),
        "Tiles": str(tiles),
        "Wood": str(wood)
    }

    return results