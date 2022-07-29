import { ReactNode } from "react";

interface EmptyPlaceholderProps {
  children: ReactNode;
}

export const EmptyPlaceholder = ({ children }: EmptyPlaceholderProps) => {
  return (
    <div className="border-4 border-dashed flex items-center justify-center py-3xl px-xl rounded-md font-medium text-gray-light">
      {children}
    </div>
  );
};
