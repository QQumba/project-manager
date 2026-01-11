import { useMemo, useRef } from 'react';

type CommandInputProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};
export default function CommandInput({
  name,
  value,
  onChange,
  onBlur,
}: CommandInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const highlightedHtml = useMemo(() => {
    return value.replace(/\{([^}]+)\}/g, '<span class="var">{$1}</span>');
  }, [value]);

  return (
    <div className="relative font-mono border-2 border-gray-500 rounded-md">
      <div
        aria-hidden
        className={`absolute inset-0 overflow-hidden whitespace-pre-wrap wrap-break-word pointer-events-none px-2 py-1`}
        dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }}
      ></div>
      <textarea
        name={name}
        ref={textareaRef}
        className="block w-full max-w-3xl
         resize-none field-sizing-content bg-transparent
         text-transparent px-2 py-1 caret-black
         outline-none overflow-auto
         selection:text-transparent selection:bg-blue-300"
        value={value}
        spellCheck={false}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        onBlur={() => {
          if (onBlur) onBlur();
        }}
      />
    </div>
  );
}
