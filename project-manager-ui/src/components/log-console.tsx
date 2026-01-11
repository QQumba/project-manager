import { useEffect, useRef } from 'react';
import { useLogStore } from '../stores/log-store';

export default function LogConsole() {
  const { logs } = useLogStore();

  const bottomRef = useRef<HTMLDivElement>(null);
  // const trimmedWorkingDir =
  //   workingDir.endsWith('/') || workingDir.endsWith('\\')
  //     ? workingDir.slice(0, -1)
  //     : workingDir;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <>
      {logs.length === 0 && (
        <div className="text-gray-400">
          Actions logs will be displayed here...
        </div>
      )}
      {logs.map((record) => (
        <div
          className={`${record.type === 'command' ? 'text-amber-300' : ''}`}
          key={record.id}
        >
          {record.message}
        </div>
      ))}
      <div ref={bottomRef} />
    </>
  );
}
