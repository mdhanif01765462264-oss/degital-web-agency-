import React from 'react';
import {
  Layout,
  TrendingUp,
  Code,
  Target,
  Search,
  Share2,
  Palette,
  Layers,
  Globe,
  ShoppingBag,
  Smartphone,
  Zap,
  Briefcase,
  Megaphone,
  CheckCircle,
  Folder
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Layout,
  TrendingUp,
  Code,
  Target,
  Search,
  Share2,
  Palette,
  Layers,
  Globe,
  ShoppingBag,
  Smartphone,
  Zap,
  Briefcase,
  Megaphone,
  CheckCircle,
  Folder
};

export function getCategoryIcon(iconName: string, className: string = 'w-6 h-6') {
  const IconComponent = iconMap[iconName] || Folder;
  return <IconComponent className={className} />;
}

export const availableIconNames = Object.keys(iconMap);
