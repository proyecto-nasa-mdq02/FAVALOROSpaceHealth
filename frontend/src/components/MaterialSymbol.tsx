interface MaterialSymbolProps {
  name: string;
  size?: number;
  className?: string;
}

export function MaterialSymbol({ name, size = 20, className = "" }: MaterialSymbolProps) {
  return (
    <span
      className={`material-symbols-rounded ${className}`.trim()}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}