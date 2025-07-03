import { useDropZoneIndicatorStyles } from "@utils/styles/drop-zone-indicator-styles";

interface DropZoneIndicatorProps {
  isActive: boolean;
  position: "left" | "right";
}

export default function DropZoneIndicator({
  isActive,
  position,
}: DropZoneIndicatorProps) {
  const styles = useDropZoneIndicatorStyles();

  if (!isActive) return null;

  const className = `${styles.indicator} ${position === "left" ? styles.left : styles.right}`;

  return <div className={className} />;
}
