# GEN AI — AI Assessment Creator

> Built for the VedaAI Full Stack Engineering Assignment.

I built this because writing question papers is honestly one of the most tedious things a teacher has to do. You know the subject, you know what you want to test — but formatting 20 questions across sections with the right difficulty and marks distribution takes forever. This app does that in seconds.

---

## What it does

A teacher fills out a simple form — subject, due date, question types, how many questions, how many marks. Hit submit, and the app hands it off to an AI worker in the background. While that's running, the UI shows a live loading state via WebSocket. When it's done, you get a clean, structured question paper — sections, difficulty tags, marks per question — ready to download as a PDF.

No raw AI output dumped on the screen. Everything is parsed into a proper data structure before it touches the UI.

---

## Tech Stack

| Layer | What I used |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Zustand |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Queue | BullMQ |
| Cache / Job State | Redis |
| Realtime | Socket.io |
| AI | Google Gemini (gemini-1.5-flash) |

-------------------------


## Project Structure

```
vedaai/
├── client/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   └── Layout.jsx          # App shell with topbar
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Assignments.jsx     # All assignments dashboard
│   │   │   ├── CreateAssignment.jsx # The form
│   │   │   └── QuestionPaper.jsx   # Generated paper + PDF download
│   │   ├── store/
│   │   │   └── assignmentStore.js  # Zustand state
│   │   ├── socket.js               # Socket.io client
│   │   └── App.jsx                 # Routes
│
└── server/                         # Express backend
    ├── ai/
    │   └── gemini.js               # Prompt engineering + JSON parser
    ├── models/
    │   └── Assignment.js           # MongoDB schema
    ├── queues/
    │   └── assignmentQueue.js      # BullMQ queue
    ├── routes/
    │   └── assignmentRoutes.js     # REST endpoints
    ├── socket/
    │   └── index.js                # Socket.io server
    ├── worker/
    │   └── generationWorker.js     # Background AI worker
    └── index.js                    # Entry point
```

---

## Getting it running locally

### Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- Redis (local or [Redis Cloud](https://redis.io/cloud/))
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/your-username/vedaai.git
cd vedaai
```

### Step 2 — Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL= http://localhost:5173(this is where forntend runs)
```

### Step 3 — Frontend setup

```bash
cd ../client
npm install
```

---

### Running the app

You'll need a few terminals open at the same time.

**Terminal 1 — Redis** (skip if using Redis Cloud)
```bash
redis-server
```

**Terminal 2 — Express server**
```bash
cd server
npm run dev
# → Mongoose Connected
# → Server running on port 8000
```

**Terminal 3 — BullMQ Worker**
```bash
cd server/worker
nodemon generationWorker.js
# → Worker started, waiting for jobs...
```

**Terminal 4 — React frontend**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you're good to go.

---

## API Endpoints

| Method | Endpoint | What it does |

| `POST`  -  `/api/assignments` -   Create assignment + queue AI job |
| `GET` -  `/api/assignments` -  Get all assignments |
| `GET` -  `/api/assignments/:id` -  Get one assignment + its result |
| `DELETE` -  `/api/assignments/:id` - Delete an assignment |

---

## A few decisions worth explaining

**Why BullMQ?**
AI generation isn't instant. If I called Gemini directly inside the Express route, the server would be blocked for 10+ seconds on every request. BullMQ lets the API respond immediately and hands the slow work off to a worker process.

**Why Socket.io + polling fallback?**
WebSockets are great but not always reliable — the client might connect after the job already finished. So I also poll MongoDB every 3 seconds as a fallback. Whichever fires first, the result shows up.

**Why parse the AI response instead of rendering it raw?**
LLMs are inconsistent. Sometimes they wrap JSON in markdown fences, sometimes they add extra commentary. The worker strips all of that and validates the structure before it ever reaches the database or the UI. If the JSON is malformed, the job is marked as failed and the user is told to try again.

--------

## Environment Variables used in project


`PORT` -  Express server port(3000)
`MONGO_URI` - MongoDB connection string
`REDIS_HOST` -  Redis host (LocalHost)
`REDIS_PORT`  - Redis port (8000)
 `GEMINI_API_KEY` -  Google Gemini API key 
  `CLIENT_URL` -  Frontend URL (for CORS)(Posrt = 5137)

---

Built by Meharjot Singh Lamba
