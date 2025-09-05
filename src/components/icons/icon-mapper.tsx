import {
  IconShield,
  IconList,
  IconDoc,
  IconSpark,
  IconCalendar,
  IconCheck,
} from "./index";

interface IconMapperProps {
  iconName: string;
  className?: string;
  size?: number;
}

export function IconMapper({ iconName, className, size }: IconMapperProps) {
  const iconMap = {
    shield: IconShield,
    list: IconList,
    doc: IconDoc,
    spark: IconSpark,
    calendar: IconCalendar,
    check: IconCheck,
  };

  const IconComponent = iconMap[iconName as keyof typeof iconMap];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
}
