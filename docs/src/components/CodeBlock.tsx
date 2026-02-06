import { useEffect, useMemo, useState, type ReactNode } from "react";

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

const CodeBlock = ({ children }: { children: ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => (typeof children === "string" ? children : String(children ?? "")), [
    children,
  ]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__label">Example</span>
        <button
          className="code-block__button"
          type="button"
          onClick={() => {
            copyText(code)
              .then(() => setCopied(true))
              .catch(() => setCopied(false));
          }}
        >
          <span className="code-block__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path
                d="M6 2h7a2 2 0 0 1 2 2v9h-2V4H6V2zm-2 4h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v8h7V8H4z"
                fill="currentColor"
              />
            </svg>
          </span>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
