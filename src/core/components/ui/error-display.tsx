export const parseServerErrors = (errorString: string | null): string[] => {
  if (!errorString) return [];

  return errorString
    .split(";")
    .map((error) => error.trim())
    .filter((error) => error.length > 0);
};

export type DisplayErrorsProp = {
  serverErrors: string[] | null;
  className?: string;
  errorItemClassName?: string;
};

export const DisplayErrors = ({
  serverErrors,
  className = "text-red-500 bg-red-50 p-4 my-2 font-bold w-full text-sm",
  errorItemClassName = "list-disc list-inside space-y-1 tracking-wide",
}: DisplayErrorsProp) => {
  if (!serverErrors || serverErrors.length === 0) return null;

  return (
    <div className={className}>
      <ul className={errorItemClassName}>
        {serverErrors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
