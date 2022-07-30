import clsx from "clsx";
import { HTMLAttributes } from "react";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {}

export const PageLayout = ({ children, ...props }: PageLayoutProps) => {
  return (
    <main
      {...props}
      className={clsx(`h-full p-md md:p-xl lg:p-2xl`, props.className)}
    >
      {children}
    </main>
  );
};
