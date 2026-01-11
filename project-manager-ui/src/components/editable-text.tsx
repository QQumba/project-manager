import { useState } from 'react';

type EditableTextProps = {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};
export default function EditableText({
  value,
  onChange,
  onBlur,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);

  function stopEditing() {
    onChange?.(value.trim());
    setEditing(false);
    onBlur?.();
  }

  return (
    <>
      {!editing && (
        <div
          className="cursor-text text-lg font-bold group flex justify-between items-center rounded-md"
          onClick={() => setEditing(true)}
        >
          {value}
        </div>
      )}
      {editing && (
        <input
          className="text-lg font-bold border-2 border-gray-600 rounded-md px-2 py-1 w-full outline-none"
          autoFocus
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={stopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter') stopEditing();
            if (e.key === 'Escape') stopEditing();
          }}
        />
      )}
    </>
  );
}
