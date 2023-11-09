import cv2
from torch.utils.data.dataset import Dataset
import numpy as np
import face_recognition
from torch import nn  # 'nn' Help us in creating & training of neural network
# Contains definition for models for addressing different tasks i.e. image classification, object detection e.t.c.
from torchvision import models
import torchvision.transforms as T
# Used for DL applications, computer vision related processes
import torch
# For image preprocessing
from torchvision import transforms
from PIL import Image


def handle_uploaded_file(f):
    with open('uploads/' + f.name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


# Extract images from a video
def frame_extract(path):
    vidObj = cv2.VideoCapture(path)
    success = 1
    while success:
        success, image = vidObj.read()
        if success:
            yield image


# Model Main Class
class Model(nn.Module):
    def __init__(self, num_classes, latent_dim=2048, lstm_layers=1, hidden_dim=2048, bidirectional=False):
        super(Model, self).__init__()

        # returns a model pretrained on ImageNet dataset
        model = models.resnext50_32x4d(pretrained=True)

        # Sequential allows us to compose modules nn together
        self.model = nn.Sequential(*list(model.children())[:-2])

        # RNN to an input sequence
        self.lstm = nn.LSTM(latent_dim, hidden_dim, lstm_layers, bidirectional)

        # Activation function
        self.relu = nn.LeakyReLU()

        # Dropping out units (hidden & visible) from NN, to avoid overfitting
        self.dp = nn.Dropout(0.4)

        # A module that creates single layer feed forward network with n inputs and m outputs
        self.linear1 = nn.Linear(2048, num_classes)

        # Applies 2D average adaptive pooling over an input signal composed of several input planes
        self.avgpool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x):
        batch_size, seq_length, c, h, w = x.shape

        # new view of array with same data
        x = x.view(batch_size * seq_length, c, h, w)

        fmap = self.model(x)
        x = self.avgpool(fmap)
        x = x.view(batch_size, seq_length, 2048)
        x_lstm, _ = self.lstm(x, None)
        return fmap, self.dp(self.linear1(x_lstm[:, -1, :]))


# For prediction of output
def predict(model, img, path='./'):
    # use this command for gpu
    # fmap, logits = model(img.to('cuda'))
    fmap, logits = model(img.to())
    params = list(model.parameters())
    weight_softmax = model.linear1.weight.detach().cpu().numpy()
    sm = nn.Softmax()
    logits = sm(logits)
    _, prediction = torch.max(logits, 1)
    confidence = logits[:, int(prediction.item())].item() * 100
    print('confidence of prediction: ',
          logits[:, int(prediction.item())].item() * 100)
    return [int(prediction.item()), confidence]


class validation_dataset(Dataset):
    def __init__(self, video_names, sequence_length=60, transform=None):
        self.video_names = video_names
        self.transform = transform
        self.count = sequence_length
        self.faceCroppedImages = []

    # To get number of videos
    def __len__(self):
        return len(self.video_names)

    # To get number of frames
    def __getitem__(self, idx):
        video_path = self.video_names[idx]
        processedFrames = []
        frames = []
        a = int(100 / self.count)
        first_frame = np.random.randint(0, a)
        for i, frame in enumerate(frame_extract(video_path)):
            faces = face_recognition.face_locations(frame)
            try:
                top, right, bottom, left = faces[0]
                frame = frame[top:bottom, left:right, :]
            except:
                pass
            frames.append(frame)
            transformedImg = self.transform(frame)
            processedFrames.append(transformedImg)

            if len(processedFrames) == self.count:
                break
        # define a transform to convert a tensor to PIL image
        transform = T.ToPILImage()
        # convert the tensor to PIL image using above transform

        # self.faceCroppedImages = [transform(img) for img in frames]
        processedFrames = torch.stack(processedFrames)
        processedFrames = processedFrames[:self.count]
        return processedFrames.unsqueeze(0)


# creating face cropped videos
def create_face_videos(path, out_dir, sequence_length, transform):
    frames = []
    first_frame = 0
    out = cv2.VideoWriter(out_dir, cv2.VideoWriter_fourcc(
        'M', 'J', 'P', 'G'), 30, (112, 112))
    for i, frame in enumerate(frame_extract(path)):
        faces = face_recognition.face_locations(frame)
        try:
            top, right, bottom, left = faces[0]
            frame = frame[top:bottom, left:right, :]
            out.write(cv2.resize(
                frames[i][top:bottom, left:right, :], (112, 112)))
        except:
            pass
        frames.append(transform(frame))
        if len(frames) == sequence_length:
            break
    frames = torch.stack(frames)
    frames = frames[:sequence_length]
    out.release()
    print(frames.unsqueeze(0))
    return frames.unsqueeze(0)


def detectFakeVideo(videoPath):
    im_size = 112
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]

    train_transforms = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((im_size, im_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)])
    path_to_videos = [videoPath]

    # create_face_videos(
    #     path_to_videos[0], 'face_cropped/', sequence_length=20, transform=train_transforms)

    video_dataset = validation_dataset(
        path_to_videos, sequence_length=20, transform=train_transforms)
    # use this command for gpu
    # model = Model(2).cuda()
    model = Model(2)
    path_to_model = 'model/new_model.pt'
    model.load_state_dict(torch.load(
        path_to_model, map_location=torch.device('cpu')))
    model.eval()
    # for (img, i) in enumerate(face_cropped):
    #     print(img)
    for i in range(0, len(path_to_videos)):
        prediction = predict(model, video_dataset[i], './')
        if prediction[0] == 1:
            print("REAL")
        else:
            print("FAKE")
    return (prediction, [])
