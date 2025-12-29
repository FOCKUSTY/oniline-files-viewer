import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode,
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const NotificationWrapperComponent = ({ className, children, ...props }: Props) => {
  return (
    <div
      className={[
        "fixed mx-[40%]",
        className
      ].join(" ")}
      {...props}
    >
      <div className="relative bottom-50">
        {children}
      </div>
    </div>
  )
};

export default NotificationWrapperComponent;
