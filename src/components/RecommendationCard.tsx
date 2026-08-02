import { ArrowRight, LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  highlight?: boolean;
}

const RecommendationCard = ({
  title,
  description,
  icon: Icon,
  link,
  highlight = false,
}: RecommendationCardProps) => {
  return (
    <button
      onClick={() => (window.location.href = link)}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      ${
        highlight
          ? "border-red-400 bg-red-50"
          : "hover:border-primary"
      }`}
    >
      <div className="mb-4">

        <Icon
          className={`w-10 h-10 ${
            highlight ? "text-red-600" : "text-primary"
          }`}
        />

      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="text-muted-foreground mt-2 leading-6">
        {description}
      </p>

      <div className="flex items-center mt-5 text-primary font-medium">
        Explore
        <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </button>
  );
};

export default RecommendationCard;