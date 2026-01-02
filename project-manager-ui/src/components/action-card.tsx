import { useEffect, useRef, useState } from 'react';
import EditableText from './editable-text';
import CommandInput from './command-input';
import VarTable from './var-table';
import { Check, Loader2, X } from 'lucide-react';
import Button from './button';
import * as signalR from '../signalr/signalr-connection';
import LogConsole, { type LogChunk } from './output-console';

type ActionCardProps = {
  title: string;
  defaultCommand: string;
  defaultWorkingDir: string;
};
export default function ActionCard({
  title,
  defaultCommand,
  defaultWorkingDir,
}: ActionCardProps) {
  const [command, setCommand] = useState(defaultCommand);
  const [workingDirectory, setWorkingDirectory] = useState(defaultWorkingDir);
  const [variablesObject, setVariablesObject] = useState<
    Record<string, string>
  >({});
  const [status, setStatus] = useState<
    'pending' | 'loading' | 'success' | 'fail'
  >('pending');

  const [logChunks, setLogChunks] = useState<LogChunk[]>([]);
  const nextLogId = useRef(0);

  useEffect(() => {
    const vars: string[] = [];
    const varsObj: Record<string, string> = {};
    let valid = true;

    let openingBraceIndex = -1;
    for (let i = 0; i < command.length; i++) {
      if (command[i] === '{') {
        if (openingBraceIndex !== -1) {
          valid = false;
        } else {
          openingBraceIndex = i;
        }
      }

      if (command[i] === '}') {
        if (openingBraceIndex !== -1) {
          const key = command.substring(openingBraceIndex + 1, i);
          if (key.length > 0) {
            vars.push(key);
            if (!Object.hasOwn(varsObj, key)) {
              varsObj[key] = '';
            }
          }
          openingBraceIndex = -1;
        } else {
          valid = false;
        }
      }
    }

    if (openingBraceIndex !== -1) {
      valid = false;
    }

    if (valid) {
      setVariablesObject(varsObj);
    } else {
      setVariablesObject({});
    }
  }, [command]);

  function assembleCommand() {
    let assembledCommand = command;
    for (let key in variablesObject) {
      assembledCommand = assembledCommand.replace(
        `{${key}}`,
        variablesObject[key]
      );
    }

    return assembledCommand;
  }

  async function runCommand() {
    setStatus('loading');

    let assembledCommand = assembleCommand();
    const response = await fetch('http://localhost:5232/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workingDirectory: workingDirectory,
        command: assembledCommand,
      }),
    });
    if (response.status !== 200) {
      setStatus('fail');
      return;
    }

    const json = await response.json();
    const jobId = json.jobId;

    await signalR.readLogs(
      jobId,
      (value) =>
        setLogChunks((chunks) => [
          ...chunks,
          { id: nextLogId.current++, text: value },
        ]),
      () => setStatus('success'),
      () => setStatus('fail')
    );
  }

  return (
    <div className="flex gap-4 justify-between items-stretch">
      <div className="border-2 rounded-md border-gray-600 p-4 flex flex-col gap-2 w-1/2 flex-1">
        <EditableText value={title} />
        <div className="flex flex-col">
          <label htmlFor="work-dir">Working directory:</label>
          <input
            className="border-2 border-gray-600 rounded-md px-2 py-1"
            placeholder="C:/..."
            type="text"
            name="work-dir"
            value={workingDirectory}
            onChange={(e) => setWorkingDirectory(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="command">Command:</label>
          <CommandInput name="command" value={command} onChange={setCommand} />
        </div>
        <VarTable value={variablesObject} onChange={setVariablesObject} />
        <div className="flex justify-around gap-2">
          <Button onClick={() => console.log(assembleCommand())}>
            Preview
          </Button>
          <Button
            className={`hover:bg-blue-600
            ${
              status === 'pending' || status === 'loading' ? 'bg-blue-500 ' : ''
            }
            ${status === 'success' ? 'bg-green-600' : ''}
            ${status === 'fail' ? 'bg-red-600' : ''}
          `}
            onClick={runCommand}
          >
            <div className="flex justify-center gap-1">
              {status === 'pending' && <span className="w-8" />}
              {status === 'loading' && (
                <Loader2 className="w-8 animate-spin"></Loader2>
              )}
              {status === 'success' && <Check className="w-8"></Check>}
              {status === 'fail' && <X className="w-8"></X>}

              <span>Run</span>
              <span className="w-8" />
            </div>
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <LogConsole workingDir={workingDirectory} chunks={logChunks} />
      </div>
    </div>
  );
}
