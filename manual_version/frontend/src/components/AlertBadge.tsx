import { Badge } from "./ui/badge.js";

interface Props {
  niveau: "normal" | "modéré" | "danger";
}

const variantMap = {
  normal:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  modéré:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  danger:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
};

export function AlertBadge({ niveau }: Props) {
  return (
    <Badge className={`font-medium ${variantMap[niveau]}`}>{niveau}</Badge>
  );
}
