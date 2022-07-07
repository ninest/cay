import clsx from "clsx";

export const Debug = ({
  data,
  wrapperClassName = "",
}: {
  data: any;
  wrapperClassName?: string;
}) => {
  return (
    <div className={clsx(wrapperClassName, "max-h-[30vh] bg-gray-800 overflow-y-scroll rounded-lg")}>
      <pre className="font-mono text-gray-200  text-xs p-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
