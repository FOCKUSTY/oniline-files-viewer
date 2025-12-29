"use client";

import type { Ref } from "react";

import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import ReactMarkdown from "react-markdown";

import styles from "./preview-component.module.css";

type Props = {
  markdown: string;
  ref: Ref<HTMLDivElement>;
};

export const PreviewComponent = ({ markdown, ref }: Props) => {
  return (
    <div className="flex flex-col h-[600px] bg-(--bg-card) py-4 px-8 rounded-lg">
      <h2>Предпросмотр</h2>

      <div
        className={[
          "rounded-lg ring-2 ring-(--fg-mini-text) h-full py-2 px-4 overflow-y-auto",
          styles.preview
        ].join(" ")}
        ref={ref}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              if (!children) {
                return;
              }
              
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: "0",
                    background: "var(--bg-component)",
                    backdropFilter: "blur(4px)"
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-smooth px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <div className="mt-2 text-xs text-(--fg-mini-text) flex justify-between">
        <span>Предпросмотр в виде HTML</span>
      </div>
    </div>
  );
};
