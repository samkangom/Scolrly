interface BadgeProps {
  label: string;
  color: "green" | "orange" | "purple" | "blue" | "yellow" | "red" | "gray";
}

const colorMap: Record<BadgeProps["color"], string> = {
  green: "bg-brand/20 text-brand",
  orange: "bg-accent-orange/20 text-accent-orange",
  purple: "bg-accent-purple/20 text-accent-purple",
  blue: "bg-accent-blue/20 text-accent-blue",
  yellow: "bg-accent-yellow/20 text-accent-yellow",
  red: "bg-danger/20 text-danger",
  gray: "bg-text-muted/20 text-text-muted",
};

export default function Badge({ label, color }: BadgeProps) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${colorMap[color]}`}>
      {label}
    </span>
  );
}
