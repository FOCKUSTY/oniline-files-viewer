import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode,
  style?: CSSProperties
}

export const NotificationWrapperComponent = ({ style, children }: Props) => {
  return (
    <div
      style={style}
      className="fixed mx-[40%]"
    >
      <div className="relative bottom-50">
        {children}
      </div>
    </div>
  )
};

export default NotificationWrapperComponent;
