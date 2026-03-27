export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-[3px] rounded-full bg-primary" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
  );
}
