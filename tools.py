import cv2
from .Models import testClassifyIndoorModel, testClassifyOutdoorModel , testInsideFloorModel, testOutsideFloorModel,testEnvironmentModel
import pathlib
import os

def analyseVideo(video, name):
    flushFiles()
    cap = cv2.VideoCapture(video)
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if (cap.isOpened() == False): # can't open movie file
        print("Error opening video stream or file")

    frameResults = []
    count = 0
    while(cap.isOpened()):
        count += 1
        ret, frame = cap.read()
        currentFrameResults = []
        if ret == True: # If there is a new frame continue
            if count % 30 == 0: # only classify every 30 frames
                print("Image %s/%s" % (count, length))
                environment = environmentClassifier(frame, count)
                currentFrameResults.append(environment)
                    
                if (environment == "Indoor"): # if the model detects the full frame to be indoor check if the floor is visible
                    floorVisible = floorClassifier(frame, count, name, "Indoor")
                    currentFrameResults.append(floorVisible)

                    if (floorVisible == "FloorVisible"): # if the model detects that the floor is visible classify the terrain
                        terrain = terrainClassifier(frame, count, name, "Indoor")
                        currentFrameResults.append(terrain)
                        currentFrameResults.append({"max": max(terrain, key=terrain.get)})

                else:
                    floorVisible = floorClassifier(frame, count, name, "Outdoor")
                    currentFrameResults.append(floorVisible)

                    if (floorVisible == "FloorVisible"):
                        terrain = terrainClassifier(frame, count, name, "Outdoor")
                        currentFrameResults.append(terrain)
                        currentFrameResults.append({"max": max(terrain, key=terrain.get)})

                frameResults.append(currentFrameResults)
        else:
            break

    cap.release()
    cv2.destroyAllWindows()

    return frameResults

def environmentClassifier(frame, count):
    cv2.imwrite('frames/full/Frame%s.jpg' % count, frame)
    dirPath = pathlib.Path(__file__).parent.absolute()
    environment = testEnvironmentModel("%s/frames/full/Frame%s.jpg" % (dirPath, count))
    labelImage(count, frame, environment, 50)
    return environment

def floorClassifier(frame, count, name, environment):
    name = os.path.splitext(name)[0]
    height_start = 280
    height_end = 720
    width_start = 400
    width_end = 900

    img_resized = frame[height_start:height_end, width_start:width_end]
    cv2.imwrite('frames/crop/%s_frame%s.jpg' % (name, count), img_resized)
    dirPath = pathlib.Path(__file__).parent.absolute()

    if(environment == "Indoor"):
        floorVisible = testInsideFloorModel("%s/frames/crop/%s_frame%s.jpg" % (dirPath, name, count))
    else:
        floorVisible = testOutsideFloorModel("%s/frames/crop/%s_frame%s.jpg" % (dirPath, name, count))
    
    labelImage(count, frame, floorVisible["Max"], 80)
    return floorVisible["Max"]

def terrainClassifier(frame, count, name, environment):
    name = os.path.splitext(name)[0]
    dirPath = pathlib.Path(__file__).parent.absolute()
    
    if (environment == "Indoor"):
        terrain = testClassifyIndoorModel("%s/frames/crop/%s_frame%s.jpg" % (dirPath, name, count))
    else: 
        terrain = testClassifyOutdoorModel("%s/frames/crop/%s_frame%s.jpg" % (dirPath, name, count))
    
    labelImage(count, frame, terrain["Max"], 110)
    return terrain


def labelImage(count, frame, label, offset):
    font                   = cv2.FONT_HERSHEY_SIMPLEX
    bottomLeftCornerOfText = (10, offset)
    fontScale              = 1
    fontColor              = (3, 3, 252)
    lineType               = 2

    cv2.putText(frame, label, bottomLeftCornerOfText, font, fontScale, fontColor,lineType)
    cv2.imwrite("labeled/Frame%s.jpg" % count, frame)

def flushFiles():
    crops = os.listdir("frames/crop")
    fulls = os.listdir("frames/full")
    labeled = os.listdir("labeled")

    for crop in crops:
        os.remove("frames/crop/%s" % crop)

    for full in fulls:
        os.remove("frames/full/%s" % full)

    for label in labeled:
        os.remove("labeled/%s" % label)
