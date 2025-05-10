import { useState } from "react";
const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(
    null
  );
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-xs text-indigo-300">Was this helpful?</span>
      <button
        onClick={() => setFeedback("positive")}
        className={`p-1 rounded-full ${
          feedback === "positive"
            ? "bg-green-700"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        👍
      </button>
      <button
        onClick={() => setFeedback("negative")}
        className={`p-1 rounded-full ${
          feedback === "negative"
            ? "bg-red-700"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        👎
      </button>
    </div>
  );
};
export default Feedback;
