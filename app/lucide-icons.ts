import {
  Snowflake,
  Star,
  Gift,
  TreePine,
  Bell,
  Coffee,
  Heart,
  Baby,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Home,
  Music,
  Flame,
  CircleDot,
  Gem,
  type LucideIcon,
} from "lucide-react";

const christmasIcons: LucideIcon[] = [
  Snowflake,
  Star,
  Gift,
  TreePine,
  Bell,
  Coffee,
  Home,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Music,
  Baby,
  Flame,
  CircleDot,
  Gem,
  TreePine,
];

export function getIconForDay(day: number): LucideIcon {
  if (day === 24) {
    return Heart;
  }
  return christmasIcons[(day - 1) % christmasIcons.length];
}
