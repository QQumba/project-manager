import { Fragment, useEffect, useState } from 'react';
import Button from './components/button';
import CommandInput from './components/command-input';
import { Check, Loader2 } from 'lucide-react';
import EditableText from './components/editable-text';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="font-mono">
      <h1>Projects</h1>
      <div className="flex flex-col items-center w-full">
        <ProjectCard name="Project 1"></ProjectCard>
      </div>
    </div>
  );
}

type ProjectCardProps = { name: string };

function ProjectCard(props: ProjectCardProps) {
  return (
    <div className="p-4 min-w-3xl">
      <h2 className="text-xl">{props.name}</h2>
      <div className="mt-2">
        <ActionCard />
      </div>
    </div>
  );
}

function ActionCard() {
  const [command, setCommand] = useState(
    'dotnet pack --version-suffix {version}'
  );
  const [variables, setVariables] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const vars: string[] = [];
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

    setIsValid(valid);
    if (valid) {
      setVariables(vars);
    } else {
      setVariables([]);
    }
  }, [command]);

  const [status, setStatus] = useState<'pending' | 'loading' | 'success'>(
    'pending'
  );

  return (
    <div className="border-2 rounded-md border-gray-600 p-4 flex flex-col gap-2">
      <EditableText value="Pack" />
      <div className="flex flex-col">
        <label htmlFor="work-dir">Working directory:</label>
        <input
          className="border-2 border-gray-600 rounded-md px-2 py-1"
          placeholder="C:/..."
          type="text"
          name="work-dir"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="command">Command:</label>
        {/* <textarea
          name="command"
          className={`border-2 rounded-md border-gray-600 p-1 px-2 field-sizing-content resize-none max-w-3xl ${
            isValid ? '' : 'border-red-500 bg-red-200'
          }`}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        /> */}
        <CommandInput name="command" value={command} onChange={setCommand} />
      </div>
      <VarTable variables={variables} />
      <div className="flex justify-around gap-2">
        <Button>Verify</Button>
        <Button
          className={`hover:bg-blue-600
            ${
              status === 'pending' || status === 'loading' ? 'bg-blue-500 ' : ''
            }
            ${status === 'success' ? 'bg-green-600' : ''}
          `}
          onClick={() => {
            setStatus('loading');
            setTimeout(() => {
              setStatus('success');
            }, 1000);
          }}
        >
          <div className="flex justify-center gap-1">
            {status === 'pending' && <span className="w-8" />}
            {status === 'loading' && (
              <Loader2 className="w-8 animate-spin"></Loader2>
            )}
            {status === 'success' && <Check className="w-8"></Check>}

            <span>Run</span>
            <span className="w-8" />
          </div>
        </Button>
      </div>
    </div>
  );
}

type VarTableProps = {
  variables: string[];
};
function VarTable(props: VarTableProps) {
  if (props.variables.length === 0) {
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

      {props.variables.map((x, i) => (
        <Fragment key={x}>
          <div
            className={`text-gray-500 border-r-2 border-gray-500 p-1 px-2 truncate ${
              i + 1 < props.variables.length ? 'border-b-2' : ''
            }`}
          >
            {x}
          </div>
          <div
            className={`font-mono text-blue-600 border-gray-500 p-1 ${
              i + 1 < props.variables.length ? 'border-b-2' : ''
            }`}
          >
            <input
              className="w-full rounded-sm px-1 focus:outline-0 focus:bg-blue-100 hover:bg-blue-50"
              type="text"
              placeholder="Enter variable value..."
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default App;
