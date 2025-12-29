import { SquarePen } from 'lucide-react';
import { useState } from 'react';

type EditableTextProps = { value: string };
export default function EditableText(props: EditableTextProps) {
  const [value, setValue] = useState(props.value);
  const [editing, setEditing] = useState(false);

  function stopEditing() {
    setValue((val) => val.trim());
    setEditing(false);
  }

  return (
    <>
      {!editing && (
        <div
          className="cursor-text text-lg font-bold group flex justify-between items-center"
          onClick={() => setEditing(true)}
        >
          <span>{value}</span>
          <SquarePen className="text-transparent transition-colors duration-500 group-hover:text-gray-500"></SquarePen>
        </div>
      )}
      {editing && (
        <input
          className="text-lg font-bold border-2 border-gray-600 rounded-md px-2 py-1"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
