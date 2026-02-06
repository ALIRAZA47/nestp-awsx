import type { ReactNode } from "react";

const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre>
    <code>{children}</code>
  </pre>
);

export default CodeBlock;
