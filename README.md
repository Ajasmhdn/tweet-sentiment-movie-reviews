# 🎬 Movie Sentiment Analysis from Tweets
A Full-Stack NLP application to analyze and visualize sentiment trends in movie reviews.

---

## 📌 Overview
This project classifies Twitter data into Positive, Negative, or Neutral sentiments using Natural Language Processing. It features a **FastAPI/Flask backend** for model inference and a **React/Next.js frontend** for user interaction.

## 🚀 Features
* **NLP Pipeline:** Tokenization, Stopword removal, and Vectorization (TF-IDF).
* **ML Model:** Trained using Scikit-learn (Logistic Regression/SVM).
* **REST API:** Fast inference endpoint for real-time analysis.
* **Modern UI:** Clean dashboard to input tweets and view sentiment scores.

---

## 📂 Project Architecture
```text
├── backend/
│   ├── app.py             # API Entry point
│   ├── model.py           # ML Model logic
│   └── requirements.txt   # Backend dependencies
├── frontend/
│   ├── src/               # React/Next.js components
│   └── package.json       # Frontend dependencies
└── README.md
