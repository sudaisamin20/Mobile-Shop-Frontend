import React from "react";
import { Box, Plus } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-16 px-4
        ${className}
      `}
    >
      <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <div className="text-gray-600">
          {icon || <Box size={48} />}
        </div>
      </div>

      <h3 className="text-white font-black text-xl sm:text-2xl mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-400 text-sm text-center max-w-sm mb-6">
        {description}
      </p>

      {action && (
        <Button
          variant="primary"
          size="sm"
          iconLeft={action.icon || <Plus size={14} />}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ── Loading Skeleton ────────────────────────

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white/5 border border-white/8 rounded-2xl h-20"
        />
      ))}
    </div>
  );
}

// ── Skeleton Row ────────────────────────────

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/4 border border-white/8 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
      </div>
      <div className="w-20 h-6 bg-white/5 rounded animate-pulse" />
    </div>
  );
}

// ── Skeleton Card ───────────────────────────

export function SkeletonCard() {
  return (
    <div className="p-6 bg-white/4 border border-white/8 rounded-2xl space-y-4">
      <div className="h-6 bg-white/5 rounded w-2/3 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-4/5 animate-pulse" />
      </div>
      <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
    </div>
  );
}
