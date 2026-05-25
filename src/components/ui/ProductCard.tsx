import { Badge } from "./Badge";
import { Button } from "./Button";
import type { LucideIcon } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  oldPrice?: string; // shows strikethrough if provided
  description?: string;
  emoji?: string;
  icon?: LucideIcon;
  imageUrl?: string;
  badge?: {
    label: string;
    variant?: "yellow" | "purple" | "blue" | "green" | "red" | "orange";
  };
  gradient?: string; // Tailwind from-X to-Y gradient classes
  inStock?: boolean;
  rating?: number; // 1-5
  onBuy?: () => void;
  onWishlist?: () => void;
  className?: string;
}

export function ProductCard({
  name,
  price,
  oldPrice,
  description,
  emoji = "📱",
  icon: IconComponent,
  imageUrl,
  badge,
  gradient = "from-purple-600 to-blue-600",
  inStock = true,
  rating,
  onBuy,
  onWishlist,
  className = "",
}: ProductCardProps) {
  return (
    <div
      className={[
        "group relative flex flex-col",
        "bg-linear-to-br from-white/8 to-white/3",
        "border border-white/10 rounded-3xl p-6",
        "transition-all duration-500",
        "hover:-translate-y-2 hover:border-purple-500/40",
        "hover:shadow-[0_20px_60px_rgba(147,51,234,0.2)]",
        className,
      ].join(" ")}
    >
      {/* Badge top-left */}
      {badge && (
        <div className="mb-4">
          <Badge variant={badge.variant ?? "yellow"}>{badge.label}</Badge>
        </div>
      )}

      {/* Wishlist button top-right */}
      {onWishlist && (
        <button
          onClick={onWishlist}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 text-sm"
          aria-label="Add to wishlist"
        >
          ♡
        </button>
      )}

      {/* Image / Emoji / Icon */}
      <div
        className={[
          "w-full h-28 flex items-center justify-center rounded-2xl mb-5",
          `bg-linear-to-br ${gradient} bg-opacity-10`,
          "group-hover:scale-105 transition-transform duration-500",
        ].join(" ")}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain rounded-2xl"
          />
        ) : IconComponent ? (
          <IconComponent size={56} className="drop-shadow-lg text-white" />
        ) : (
          <span className="text-6xl drop-shadow-lg">{emoji}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1.5">
        <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xs ${star <= rating ? "text-yellow-400" : "text-gray-700"}`}
              >
                ★
              </span>
            ))}
            <span className="text-gray-500 text-[10px] ml-1">({rating}.0)</span>
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
        <div>
          <p className="text-yellow-400 font-black text-base leading-tight">
            {price}
          </p>
          {oldPrice && (
            <p className="text-gray-600 text-xs line-through">{oldPrice}</p>
          )}
        </div>

        {inStock ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onBuy}
            className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
          >
            Buy
          </Button>
        ) : (
          <Badge variant="red">Out of Stock</Badge>
        )}
      </div>

      {/* Hover glow overlay */}
      <div
        className={[
          "absolute inset-0 rounded-3xl",
          `bg-linear-to-br ${gradient}`,
          "opacity-0 group-hover:opacity-5",
          "transition-opacity duration-500 pointer-events-none",
        ].join(" ")}
      />
    </div>
  );
}

export default ProductCard;
