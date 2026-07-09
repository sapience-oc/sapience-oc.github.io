import { useDraggableSheet } from '../hooks/useDraggableSheet';
import './GradientSheet.css';


export default function GradientSheet({
  headerContent,
  maxHeight = 220,
  minHeight = 84,
  children,
  contentClassName = '',
}) {
  const { headerHeight, progress, onScroll } = useDraggableSheet({ maxHeight, minHeight });

  return (
    <div className="gsheet gradient-bg">
      {headerContent && (
        <div className="gsheet-header" style={{ height: headerHeight }}>
          <div className="gsheet-header-inner" style={{ opacity: Math.max(0, 1 - progress * 1.6) }}>
            {headerContent}
          </div>
        </div>
      )}

      <div
        className={`gsheet-sheet ${contentClassName}`}
        style={{ marginTop: headerHeight }}
        onScroll={onScroll}
      >
        <div className="gsheet-sheet-content">{children}</div>
      </div>
    </div>
  );
}
