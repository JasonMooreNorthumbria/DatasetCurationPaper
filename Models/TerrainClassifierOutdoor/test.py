import tensorflow as tf
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.optimizers import RMSprop
from tensorflow.keras.layers import Dense, Flatten, Dropout
from skimage.transform import resize
import numpy as np
import pathlib
import matplotlib.pyplot as plt

base_model = InceptionV3(input_shape=(299, 299, 3), weights='imagenet', include_top=False)

for layer in base_model.layers:
    layer.trainable = False

x = Flatten()(base_model.output)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.2)(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.2)(x)
x = Dense(7, activation='softmax')(x)

model = tf.keras.models.Model(base_model.input, x)
model.load_weights("%s/Terrain_Outdoor_Weights.h5" % pathlib.Path(__file__).parent.absolute())

def testClassifyOutdoorModel(image):
    labels = ["Asphalt", "ConcreteBlock", "Grass", "Gravel", "Sand", "Snow", "Woodland"]
    img = plt.imread(image)
    imgResized = resize(img, (299, 299, 3))
    imgResized.astype('float32')
    pred = model.predict(np.array([imgResized]))
    top = np.argmax(pred)
    
    asphalt = pred[0][0]
    concreteblock = pred[0][1]
    grass = pred[0][2]
    gravel = pred[0][3]
    sand = pred[0][4]
    snow = pred[0][5]
    woodland = pred[0][6]

    results = {
        "Max": labels[top],
        "Asphalt": str(asphalt),
        "ConcreteBlock": str(concreteblock),
        "Grass": str(grass),
        "Gravel": str(gravel),
        "Sand": str(sand),
        "Snow": str(snow),
        "Woodland": str(woodland),
    }

    return results