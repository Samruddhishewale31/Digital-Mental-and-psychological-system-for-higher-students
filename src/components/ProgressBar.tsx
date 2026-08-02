interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  showScore?: boolean;
}

const ProgressBar = ({
  value,
  max,
  label,
  color = "bg-primary",
  showScore = true,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">

      {label && (
        <div className="flex justify-between items-center mb-2">

          <span className="font-medium">
            {label}
          </span>

          {showScore && (
            <span className="text-sm text-muted-foreground">
              {value}/{max}
            </span>
          )}

        </div>
      )}

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
};

export default ProgressBar;