# FluencyAI — Speech Therapy & Fluency Care Platform

FluencyAI is a clinical speech therapy and fluency practice web application. It integrates motor-speech exercises, daily practice routines, licensed Speech-Language Pathologist (CCC-SLP) consultations, and AI-assisted speech counselling.

---

## 🌟 Key Features

- **Daily Guided Practice**: Evidence-informed drills for diaphragmatic breathing, gentle phonatory onset, and pacing control.
- **AI Speech Counsellor**: CBT-informed conversational guidance for speaking situations and situational anxiety.
- **SLP Telehealth Directory**: Find, review, and book sessions with board-certified speech pathologists.
- **Private & Secure**: Strict patient record scoping — patients can only access their own appointments and data.
- **Real-Time Acoustic Feedback**: Visual biofeedback using the Web Audio API.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Deployment**: Ready for Vercel Serverless & Docker/Cloud Run

---

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fluency-ai.git
   cd fluency-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push this repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New..."** → **"Project"**.
3. Import your GitHub repository.
4. Add the environment variable:
   - `GEMINI_API_KEY`: Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
5. Click **Deploy**. Vercel will automatically detect `vercel.json` and deploy both the Vite frontend and serverless API functions.
