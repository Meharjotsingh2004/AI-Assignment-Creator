import { create } from "zustand";

const useAssignmentStore = create((set) => ({
  // Form state
  formData: {
    subject: "",
    dueDate: "",
    questionTypes: [],
    totalQuestions: "",
    totalMarks: "",
    additionalInstructions: "",
  },

  // Assignment state
  assignmentId: null,
  status: "idle", // idle | processing | completed | failed
  result: null,

  // Actions
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setAssignmentId: (id) => set({ assignmentId: id }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),

  reset: () =>
    set({
      formData: {
        subject: "",
        dueDate: "",
        questionTypes: [],
        totalQuestions: "",
        totalMarks: "",
        additionalInstructions: "",
      },
      assignmentId: null,
      status: "idle",
      result: null,
    }),
}));

export default useAssignmentStore;