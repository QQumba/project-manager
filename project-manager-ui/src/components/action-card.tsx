import { useEffect, useState } from 'react';
import EditableText from './editable-text';
import CommandInput from './command-input';
import VarTable from './var-table';
import { Check, EllipsisVertical, Loader2, Trash2, X } from 'lucide-react';
import Button from './button';
import * as signalR from '../signalr/signalr-connection';
import { useLogStore } from '../stores/log-store';
import { useActionStore, type Action } from '../stores/action-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { API_URL } from '../lib/api';

type ActionCardProps = {
  action: Action;
};

export default function ActionCard({ action }: ActionCardProps) {
  const [name, setName] = useState(action.name);
  const [command, setCommand] = useState(action.command);
  const [workingDir, setWorkingDir] = useState(action.workingDir);
  const [args, setArgs] = useState(action.args);

  const [status, setStatus] = useState<
    'pending' | 'loading' | 'success' | 'fail'
  >('pending');

  const { addLog } = useLogStore();
  const { updateAction, deleteAction } = useActionStore();

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
              varsObj[key] = action.args[key] ?? '';
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
      setArgs(varsObj);
    } else {
      setArgs({});
    }
  }, [command]);

  function assembleCommand() {
    let assembledCommand = command;
    for (let key in args) {
      assembledCommand = assembledCommand.replace(`{${key}}`, args[key]);
    }

    return assembledCommand;
  }

  async function onRunCommand() {
    if (status === 'loading') {
      return;
    }
    setStatus('loading');

    let assembledCommand = assembleCommand();
    const response = await fetch('http://localhost:5232/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workingDirectory: workingDir,
        command: assembledCommand,
      }),
    });
    if (response.status !== 200) {
      setStatus('fail');
      return;
    }

    const json = await response.json();
    const jobId = json.jobId;

    addLog({ message: `${workingDir}> ${assembleCommand()}`, type: 'command' });
    await signalR.readLogs(
      jobId,
      (value) => addLog({ message: value, type: 'default' }),
      () => setStatus('success'),
      () => setStatus('fail')
    );
  }

  async function onDeleteAction() {
    const response = await fetch(`${API_URL}/actions/${action.id}`, {
      method: 'DELETE',
    });

    if (response.status !== 200) {
      return;
    }

    deleteAction(action.id);
  }

  async function onUpdateAction() {
    const response = await fetch(`${API_URL}/actions/${action.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...action,
        name,
        command,
        workingDir,
        args: { ...action.args, ...args },
      }),
    });

    if (response.status !== 200) {
      return;
    }

    const updatedAction = await response.json();
    updateAction(updatedAction);
  }

  return (
    <div
      className="flex flex-col gap-2
                 border rounded-md
                 p-4 w-full
                 shadow-lg bg-white"
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1">
          <EditableText
            value={name}
            onChange={setName}
            onBlur={onUpdateAction}
          />
        </div>
        <ActionCardDropdownMenu onDelete={onDeleteAction} />
      </div>
      <div className="flex flex-col">
        <label htmlFor="work-dir">Working directory:</label>
        <input
          className="border-2 border-gray-500 rounded-md px-2 py-1 outline-none"
          placeholder="C:/..."
          type="text"
          name="work-dir"
          value={workingDir}
          onChange={(e) => setWorkingDir(e.target.value)}
          onBlur={onUpdateAction}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="command">Command:</label>
        <CommandInput
          name="command"
          value={command}
          onChange={setCommand}
          onBlur={onUpdateAction}
        />
      </div>
      <VarTable value={args} onChange={setArgs} onBlur={onUpdateAction} />
      <div className="flex justify-around gap-2">
        <Button
          onClick={() => {
            const assembledCommand = assembleCommand();
            addLog({
              message: `[ACTION PREVIEW] ${assembledCommand}`,
              type: 'preview',
            });
          }}
        >
          Preview
        </Button>
        <Button
          className={`hover:bg-blue-600
            ${status === 'pending' || status === 'loading' ? 'bg-blue-500' : ''}
            ${status === 'loading' ? 'cursor-not-allowed' : ''}
            ${status === 'success' ? 'bg-green-600' : ''}
            ${status === 'fail' ? 'bg-red-600' : ''}
          `}
          onClick={onRunCommand}
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
  );
}

type ActionCardDropdownMenuProps = {
  onDelete?: () => void;
};
function ActionCardDropdownMenu({ onDelete }: ActionCardDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="rounded-md text-gray-800 p-1 cursor-pointer hover:bg-gray-100">
          <EllipsisVertical className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24" align="end">
        <DropdownMenuItem
          className="font-mono cursor-pointer"
          variant="destructive"
          onClick={onDelete}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="text-red-500" />
            <div>Delete</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
