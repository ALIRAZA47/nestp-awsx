import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  fileName?: string;
  className?: string;
};

const languageAliases: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  sh: "bash",
  bash: "bash",
  md: "markdown",
  txt: "text",
};

export function CodeBlock({ code, language = "ts", fileName, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const normalized = useMemo(() => code.trim(), [code]);
  const resolvedLanguage = useMemo(
    () => languageAliases[language.toLowerCase()] ?? language.toLowerCase(),
    [language],
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/25 bg-[linear-gradient(145deg,rgba(17,24,39,0.88),rgba(2,6,23,0.84))] shadow-[0_18px_40px_rgba(15,23,42,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_88%_18%,rgba(129,140,248,0.2),transparent_36%)]" />
      <div className="relative flex items-center justify-between border-b border-white/15 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[11px] text-zinc-200">
            {fileName ?? `snippet.${resolvedLanguage}`}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-400">
            {resolvedLanguage}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-zinc-200 hover:bg-white/10 hover:text-zinc-100"
          onClick={async () => {
            await navigator.clipboard.writeText(normalized);
            setCopied(true);
          }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <Highlight theme={themes.vsDark} code={normalized} language={resolvedLanguage}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              highlightClassName,
              "relative w-full whitespace-pre-wrap break-words bg-transparent p-4 text-[13px] leading-6 text-zinc-100",
            )}
            style={style}
          >
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line });
              return (
                <div
                  key={`line-${lineIndex}`}
                  className={cn("table w-full table-fixed", lineProps.className)}
                  style={lineProps.style}
                >
                  <span className="table-cell w-10 select-none pr-4 text-right text-xs text-zinc-500">
                    {lineIndex + 1}
                  </span>
                  <span className="table-cell whitespace-pre-wrap break-words text-left">
                    {line.map((token, tokenIndex) => {
                      const tokenProps = getTokenProps({ token });
                      return (
                        <span
                          key={`line-${lineIndex}-token-${tokenIndex}`}
                          className={tokenProps.className}
                          style={tokenProps.style}
                        >
                          {tokenProps.children}
                        </span>
                      );
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
