import { useEffect, useRef } from 'react';

export type LogChunk = {
  id: number;
  text: string;
};

type LogConsoleProps = {
  workingDir: string;
  chunks: LogChunk[];
};

export default function LogConsole({ workingDir, chunks }: LogConsoleProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trimmedWorkingDir =
    workingDir.endsWith('/') || workingDir.endsWith('\\')
      ? workingDir.slice(0, -1)
      : workingDir;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chunks]);

  return (
    <div className="h-full bg-gray-800 text-gray-100 rounded-md p-4 overflow-auto">
      <div>{trimmedWorkingDir}&gt;</div>
      {chunks.map((chunk) => (
        <div key={chunk.id}>{chunk.text}</div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
