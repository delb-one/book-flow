type CountProps = {
  count: number;
  label?: string;
};

export function Count({ count, label = "autori trovati" }: CountProps) {
  return (
    <div className="text-sm text-muted-foreground">
      {count} {label}
    </div>
  );
}
