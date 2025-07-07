from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

EMOTION_CATEGORIES = {
    'positive': {'happy', 'surprise'},
    'negative': {'angry', 'sad', 'fear', 'disgust'},
    'neutral': {'neutral'}
}

def classify_emotion(emotion):
    for category, emotions in EMOTION_CATEGORIES.items():
        if emotion in emotions:
            return category
    return "unknown"

@app.route('/api/emotion', methods=['POST'])
def emotion():
    data = request.json
    img_data = data['image'].split(',')[1]
    img_bytes = base64.b64decode(img_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False, detector_backend='mediapipe', silent=True)
    dominant_emotion = result[0]['dominant_emotion'] if isinstance(result, list) else result['dominant_emotion']
    emotion_category = classify_emotion(dominant_emotion)
    return jsonify({'emotion': dominant_emotion, 'category': emotion_category})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)