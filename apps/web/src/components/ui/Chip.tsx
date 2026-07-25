export function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-moss-tint px-2.5 py-0.5 font-mono text-[0.7rem] font-medium tracking-wide text-moss">
      {children}
    </span>
  );
}
