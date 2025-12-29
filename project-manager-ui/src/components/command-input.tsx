import { useMemo, useRef } from 'react';

type CommandInputProps = {
  name: string;
  value: string;
  onChange: ((value: string) => void) | null;
};
export default function CommandInput(props: CommandInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const highlightedHtml = useMemo(() => {
    return props.value.replace(/\{([^}]+)\}/g, '<span class="var">{$1}</span>');
  }, [props.value]);

  return (
    <div className="relative font-mono border-2 border-gray-600 rounded-md">
      <div
        aria-hidden
        className={`absolute inset-0 overflow-hidden whitespace-pre-wrap wrap-break-word pointer-events-none px-2 py-1`}
        dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }}
      ></div>
      <textarea
        name={props.name}
        ref={textareaRef}
        className="block w-full max-w-3xl
         resize-none field-sizing-content bg-transparent
         text-transparent px-2 py-1 caret-black
         outline-none overflow-auto
         selection:text-transparent selection:bg-blue-300"
        value={props.value}
        spellCheck={false}
        onChange={(e) => {
          if (props.onChange) props.onChange(e.target.value);
        }}
      />
    </div>
  );
}
