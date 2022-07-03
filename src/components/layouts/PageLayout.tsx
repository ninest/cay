import { HTMLAttributes } from "react";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {}

export const PageLayout = ({ children, ...props }: PageLayoutProps) => {
  return (
    <main {...props} className="h-screen p-md md:p-xl lg:p-2xl">
      {children}
    </main>
  );
};
