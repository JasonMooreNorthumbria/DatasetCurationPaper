from flask import Flask, jsonify, request
from .tools import analyseVideo
from flask_cors import CORS
import youtube_dl
import time
import os
import pathlib
import cv2
import csv
import pafy
import re

app = Flask(__name__)
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.gif', '.mp4']
app.config['UPLOAD_PATH'] = 'uploads'

CORS(app)
ydl_opts = { 'format':' bestvideo[ext=mp4]+bestaudio[ext=mp4]/mp4', 'outtmpl': 'uploads/%(title)s.%(ext)s'}


@app.route("/youtube", methods=["POST"])
def getLink():
    req = request.get_json()
    link = req["link"]
    return downloadYoutube(link)

def downloadYoutube(link):
    print("Downloading Video...")
    purgeUploadFolder()


    time.sleep(1.5) # Repeated youtube queries in a quick time successions seems to cause issues
    try:
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([link])
    except:
        print("There was an error with YouTube... retrying..")
        downloadYoutube(link)

    newFileName = renameVideo()
    print("Video Downloaded Succesfully... \n")
    video = pafy.new(link)
    videoTags = [video.title, video.author, link]

    with open("sources.csv", 'a', encoding="utf-8", newline='') as fd:
        writer = csv.writer(fd)
        writer.writerow(videoTags)

    message = {"Success" : True, "Filename" : newFileName}
    return jsonify(message)

def purgeUploadFolder():
    prevFile = os.listdir("uploads")
    for file in prevFile:
        os.remove("uploads/%s" % file)

def renameVideo():
    oldFilename = os.listdir("uploads")[0]
    newFilename = oldFilename.replace(" ", "").encode('ascii', 'ignore').decode('ascii')
    newFilename = newFilename.replace("#", "").encode('ascii', 'ignore').decode('ascii')
    newFilename = newFilename.replace(",", "").encode('ascii', 'ignore').decode('ascii')
    
    try:
        os.rename("uploads/%s" % oldFilename, "uploads/%s" % newFilename)
    except:
        os.remove("uploads/%s" % oldFilename)
        os.rename("uploads/%s" % oldFilename, "uploads/%s" % newFilename)
    return newFilename

@app.route("/analyse", methods=["GET"])
def analyse():
    video = os.listdir("uploads")[0]
    videoFile = "%s/uploads/%s" % (pathlib.Path(__file__).parent.absolute(), video)
    
    results = analyseVideo(videoFile, video)
    cap = cv2.VideoCapture(videoFile)
    fps = cap.get(cv2.CAP_PROP_FPS)
    totalFrame = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    return jsonify({"FrameRate" : str(fps), "TotalFrames" : totalFrame, "Results" : results})


