vedaai/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignmentForm.jsx      # Teacher input form
│   │   │   └── QuestionPaper.jsx       # Output display
│   │   ├── store/
│   │   │   └── assignmentStore.js      # Zustand state
│   │   ├── socket.js                   # WebSocket client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── models/
│   │   └── Assignment.js       # MongoDB schema
│   ├── routes/
│   │   └── assignment.js       # REST endpoints
│   ├── workers/
│   │   └── generationWorker.js # BullMQ worker (AI call)
│   ├── queues/
│   │   └── assignmentQueue.js  # BullMQ queue setup
│   ├── socket/
│   │   └── index.js            # WebSocket server
│   ├── ai/
│   │   └── gemini.js           # Gemini prompt + parser
│   ├── index.js                # Entry point
│   └── package.json
│
└── README.md