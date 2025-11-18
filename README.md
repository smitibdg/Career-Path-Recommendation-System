# 🚀 AI-Powered Career Path Recommendation System

> An intelligent, full-stack web application designed to guide students toward their ideal career paths using psychometric assessments and AI-driven analysis.

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Future Roadmap](#-future-roadmap)
- [Contact](#-contact)

---

## 💡 Overview
The **Career Path Recommendation System (CPRS)** addresses the confusion students face when choosing a career. By combining traditional psychometric testing (Big Five Personality, Skills, Cognitive abilities) with modern AI (Large Language Models), this system provides personalized, data-backed career advice.

The system evaluates a student's profile and recommends specific career clusters and job roles, complete with learning resources and college filters.

---

## ✨ Key Features
* **🔐 Secure Authentication:** User registration and login using JWT (JSON Web Tokens) with secure password hashing.
* **🧠 5-Part Assessment Engine:** Interactive tests covering:
    * Personality Traits (Big Five)
    * Cognitive Abilities
    * Technical & Soft Skills
    * Situational Judgment
    * Core Values
* **🤖 AI Chatbot Assistant:** A built-in conversational AI (powered by Google Gemini) that answers career queries and guides users through the platform.
* **📊 ML-Based Recommendations:** Uses decision trees and hybrid filtering to match user scores with 16+ career clusters and 200+ job roles.
* **📈 Interactive Dashboard:** Visualizes test results and confidence scores for recommended roles.
* **🏫 College & Resource Finder:** (In Progress) Helps students find colleges and courses matching their budget and location.

---

## 🏗 System Architecture

![System Flowchart](./screenshots/flowchart.jpg)

---

## 📸 Screenshots

### 1. Landing Page
![Landing Page](./screenshots/LandingPg1.png)
![Landing Page](./screenshots/LandingPg2.png)
![Landing Page](./screenshots/LandingPg3.png)
![Landing Page](./screenshots/LandingPg4.png)

### 2. Student Dashboard & Results
![Dashboard](./screenshots/DashboardPg1.png)
![Dashboard](./screenshots/DashboardPg2.png)
![Dashboard](./screenshots/DashboardPg3.png)

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, HTML5, CSS3, Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas Cloud) |
| **AI / ML** | Python (Scikit-learn), API |
| **Authentication** | JWT, Bcrypt.js |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js installed
* MongoDB installed locally or a MongoDB Atlas account
* Git installed

### 1. Clone the Repository
```bash
git clone [https://github.com/smitibdg/Career-Path-Recommendation-System.git](https://github.com/smitibdg/Career-Path-Recommendation-System.git)
cd Career-Path-Recommendation-System

### **👤 Author**
Smiti Badugu
Role: Full Stack Developer & Data Science Student
Institution: S.I.E.S. College of Arts, Science & Commerce
Made with ❤️ and ☕ for the final year project.
