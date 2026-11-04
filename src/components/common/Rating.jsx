import React from "react";
import { Star } from "lucide-react";

export const Rating = ({ rating = 5, count = null, size = "sm", interactive = false, onRatingChange = null }) => {
  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          >
            <Star
              className={`${starSizes[size]} ${
                star <= Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 fill-gray-100"
              }`}
            />
          </button>
        ))}
      </div>
      {count !== null && (
        <span className="text-xs text-mauve font-medium ml-1">({count})</span>
      )}
    </div>
  );
};

