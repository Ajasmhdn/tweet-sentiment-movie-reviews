from flask import Flask, request, jsonify
import pickle
import re
from flask_cors import CORS
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
CORS(app)

# Load trained model and vectorizer
model = pickle.load(open("basic_svm_model_emojiadded.pkl", "rb"))
vectorizer = pickle.load(open("basic_vectorizer_emojiadded.pkl", "rb"))

lemmatizer = WordNetLemmatizer()

# Clean text (same as training)
def clean_text(text):
    text = text.lower()

    # handle emojis
    text = replace_emojis(text)

    # handle negation
    text = re.sub(r"n't", " not", text)

    # remove URLs
    text = re.sub(r'http\S+', '', text)

    # remove special characters
    text = re.sub(r'[^a-z\s]', '', text)

    words = text.split()
    words = [w for w in words if len(w) > 2]
    words = [lemmatizer.lemmatize(w) for w in words]

    return " ".join(words)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "Empty input"}), 400

        # Preprocess
        cleaned = clean_text(text)

        # Vectorize
        vec = vectorizer.transform([cleaned])

        # Predict
        prediction = int(model.predict(vec)[0])

        return jsonify({
            "prediction": prediction   # 0,1,2
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Sentiment Analysis API is running 🚀"


if __name__ == "__main__":
    app.run(debug=True)
