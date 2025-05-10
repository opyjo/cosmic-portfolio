const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 p-2">
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};
export default TypingIndicator;
