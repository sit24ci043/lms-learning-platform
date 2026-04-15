interface Props {
  value: number;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar = ({ value, className = '', showLabel = true }: Props) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
