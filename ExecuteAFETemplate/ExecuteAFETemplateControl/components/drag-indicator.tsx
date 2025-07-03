import { Tooltip } from "@fluentui/react-components";
import { ReOrder20Regular } from "@fluentui/react-icons";
import { useDragIndicatorStyles } from "@utils/styles/drag-indicator-styles";

interface DragIndicatorProps {
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export default function DragIndicator({
  isDragging = false,
  isDropTarget = false,
}: DragIndicatorProps) {
  const styles = useDragIndicatorStyles();

  const getClassName = () => {
    let className = styles.container;
    if (isDragging) {
      className += ` ${styles.dragging}`;
    } else if (isDropTarget) {
      className += ` ${styles.dropTarget}`;
    } else {
      className += ` ${styles.default}`;
    }
    return className;
  };

  return (
    <Tooltip content="Drag to reorder columns" relationship="label">
      <div className={getClassName()}>
        <ReOrder20Regular />
      </div>
    </Tooltip>
  );
}
