let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Client joins a room using assignmentId
    socket.on("join", (assignmentId) => {
      socket.join(assignmentId);
      console.log(`Socket ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// Called from worker to emit updates to a specific assignment room
export const getIO = () => ioInstance;