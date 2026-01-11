import { Fragment } from 'react';

type VarTableProps = {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onBlur?: () => void;
};
export default function VarTable({ value, onChange, onBlur }: VarTableProps) {
  const variablesCount = Object.keys(value).length;

  if (variablesCount === 0) {
    return <div>Command does not contain any variables</div>;
  }

  return (
    <div className="grid grid-cols-2 border-2 border-gray-500 rounded-md overflow-clip">
      <div className="font-bold border-r-2 border-b-2 bg-gray-200 border-gray-500 p-1 px-2">
        Key
      </div>
      <div className="font-bold border-b-2 border-gray-500 bg-gray-200 p-1 px-2">
        Value
      </div>

      {Object.keys(value).map((x, i) => (
        <Fragment key={x}>
          <div
            className={`text-gray-500 border-r-2 border-gray-500 p-1 px-2 truncate ${
              i < variablesCount - 1 ? 'border-b-2' : ''
            }`}
          >
            {x}
          </div>
          <div
            className={`font-mono text-blue-600 border-gray-500 p-1 ${
              i < variablesCount - 1 ? 'border-b-2' : ''
            }`}
          >
            <input
              className="w-full rounded-sm px-1 focus:outline-0 focus:bg-blue-100 hover:bg-blue-50"
              type="text"
              placeholder="Enter variable value..."
              value={value[x] ?? ''}
              onChange={(e) => {
                const newVar = {
                  ...value,
                  [x]: e.target.value,
                };
                onChange(newVar);
              }}
              onBlur={() => onBlur?.()}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
