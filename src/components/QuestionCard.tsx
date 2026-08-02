import { motion } from "framer-motion";

interface Option {
  label: string;
  value: number;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedAnswer: number;
  onSelect: (value: number) => void;
}

const QuestionCard = ({
  question,
  options,
  selectedAnswer,
  onSelect,
}: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-3xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold mb-8 leading-relaxed">
        {question}
      </h2>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300
              ${
                selectedAnswer === option.value
                  ? "border-primary bg-primary/10 shadow-md"
                  : "hover:bg-muted hover:border-primary/40"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionCard;