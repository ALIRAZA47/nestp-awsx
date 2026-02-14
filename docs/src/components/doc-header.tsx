import { Badge } from "@/components/ui/badge";

type DocHeaderProps = {
  badge?: string;
  title: string;
  description: string;
};

export function DocHeader({ badge, title, description }: DocHeaderProps) {
  return (
    <header className="space-y-3">
      {badge ? <Badge variant="secondary">{badge}</Badge> : null}
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
    </header>
  );
}
