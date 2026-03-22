import torch
from torch import nn
import numpy as np
import os
from PIL import Image

# =============================
# CNN MODEL (MATCHES YOUR model.pth)
# =============================

class CNN(nn.Module):

    def __init__(self):
        super().__init__()

        # ✅ FIX: change 16 → 32
        self.conv = nn.Conv2d(1, 32, 3)

        self.pool = nn.MaxPool2d(2, 2)

        # ⚠️ FC size stays same (based on your error log)
        self.fc = nn.Linear(5408, 10)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv(x)))
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return torch.log_softmax(x, dim=1)


# =============================
# MODEL PATH
# =============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    os.path.dirname(BASE_DIR),
    "mnist-canvas",
    "mnist",
    "model.pth"
)

# =============================
# LOAD MODEL
# =============================

model = CNN()

try:
    if os.path.exists(MODEL_PATH):

        model.load_state_dict(
            torch.load(MODEL_PATH, map_location=torch.device("cpu"))
        )

        model.eval()

        print(f"✅ CNN Model Loaded Successfully from: {MODEL_PATH}")

    else:
        print(f"❌ Model file not found: {MODEL_PATH}")

except Exception as e:
    print(f"❌ Error loading model: {e}")


# =============================
# IMAGE PREPROCESS FUNCTION
# =============================

def preprocess_image(image):

    # convert to grayscale
    image = image.convert("L")

    # resize to MNIST size
    image = image.resize((28, 28))

    # convert to numpy
    img = np.array(image, dtype=np.float32)

    # normalize
    img = img / 255.0

    # reshape → (1,1,28,28)
    img = img.reshape(1, 1, 28, 28)

    return img


# =============================
# PREDICT FUNCTION
# =============================

def predict_digit(image):

    try:

        img = preprocess_image(image)

        img = torch.tensor(img).float()

        with torch.no_grad():

            output = model(img)

            _, predicted = torch.max(output, 1)

        return int(predicted.item())

    except Exception as e:

        print("❌ Prediction Error:", e)
        return -1