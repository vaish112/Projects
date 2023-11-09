import torch
import os
import cv2
import face_recognition
import glob

# For image preprocessing
from torchvision import transforms
from PIL import Image
import keras
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Model
from keras.preprocessing import image
from keras.applications.imagenet_utils import preprocess_input
from tensorflow.keras.applications.resnet50 import decode_predictions, preprocess_input
from keras.models import load_model
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
import glob
import numpy as np
import pandas as pd
import shutil
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder
model = load_model(
    'D:\deepfake_detection\datasets\\new_densenet-121\\new_densenet-121-acc-81.h5')


def handle_uploaded_file(f):
    with open('uploads_v2/' + f.name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def frame_extract():
    folderName = 'uploads_v2'
    # os.listdir returns the list of all files present in directory passed to it as argument.
    for filename in os.listdir(f"{folderName}/"):
        print(f"{folderName}/{filename}/")
        # checking whether the file format is correct or not
        if filename.endswith('.mp4'):
            print(filename)
            # cv2.VideoCapture is used for capturing provided video
            cap = cv2.VideoCapture(f'{folderName}/{filename}')
            cnt = 0
            n = 80
            flag = 0
            gap = 60
            nos_of_frames = 0

            extract, _ = filename.split('.mp4')  # for naming the images

            while cap.isOpened():  # checking whether the video is captured or not
                # cap.read() reads the frame from the captured video and ret tells whether frame is readed properly or not
                ret, img = cap.read()
                if ret:
                    if img.size == 0:
                        break
                    elif len(img.shape) < 2:
                        gray = img
                    else:
                        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

                    # Detect the faces
                    faces = face_recognition.face_locations(img)

                    try:
                        if cnt % gap == 0 or flag == 1:
                            # print("try loop", cnt)
                            top, right, bottom, left = faces[0]
                            img = img[top-n:bottom+n, left-n:right+n, :]
                            #cv2.imshow("frame"  ,img)
                            nos_of_frames += 1
                            cv2.imwrite('frame_extract_v2/' + extract +
                                        '_' + nos_of_frames + '.jpg', img)
                            flag = 0
                    except:
                        print("face not detected ", cnt)
                        flag = 1
                        cnt += 1
                        continue

                    cnt += 1
                else:
                    break
            cv2.destroyAllWindows()


def main_detection():
    frame_extract()
