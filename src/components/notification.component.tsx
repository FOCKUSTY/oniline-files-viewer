import type { ReactNode } from "react";

import { HiOutlineExclamationCircle } from "react-icons/hi";

type Props = {
  children: ReactNode;
};

export const NotificationComponent = ({ children }: Props) => {
  return (
    <div className={[
      "bg-(--bg-component) w-max px-4 py-2 rounded-lg",
      "flex flex-row gap-2"
    ].join(" ")}>
      <HiOutlineExclamationCircle size={24} />
      <span>
        {children}
      </span>
    </div>
  )
};

export default NotificationComponent;
