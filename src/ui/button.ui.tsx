import type { ReactNode } from "react";

export const button = [
  "default",
  "primary",
  "danger",
  "secondary",
  "tetriary",
] as const;

type Props = {
  children: ReactNode;
  type?: (typeof button)[number];
};

export const Button = ({ children, type = "default" }: Props) => {
  return (
    <button
      className={[
        "bg-(--fg-card) px-1 py-2 rounded-lg page",
        `color-${type}`,
      ].join(" ")}
    >
      {children}
    </button>
  );
};
