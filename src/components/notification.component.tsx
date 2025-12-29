import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { HiOutlineExclamationCircle } from "react-icons/hi";

type Props = {
  children: ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const NotificationComponent = ({
  children,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={[
        "bg-(--bg-default) w-max px-4 py-2 rounded-lg",
        "flex flex-row gap-2",
        className,
      ].join(" ")}
      {...props}
    >
      <HiOutlineExclamationCircle size={24} />
      <span>{children}</span>
    </div>
  );
};

export default NotificationComponent;
