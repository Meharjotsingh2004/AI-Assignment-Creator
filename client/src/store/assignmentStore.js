import { create } from "zustand";

const useAssignmentStore = create((set) => ({
  assignmentId: null,
  status: "idle",
  result: null,
  setAssignmentId: (id) => set({ assignmentId: id }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),
  reset: () => set({ assignmentId: null, status: "idle", result: null }),
}));

export default useAssignmentStore;