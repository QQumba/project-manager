import { useEffect } from 'react';
import ActionCard from './components/action-card';
import LogConsole from './components/log-console';
import { useActionStore, type Action } from './stores/action-store';
import Button from './components/button';

function App() {
  return (
    <div className="font-mono h-screen grid grid-cols-[1fr_1fr]">
      <ActionList />
      <div className="h-full bg-gray-800 text-gray-100 p-4 overflow-y-auto console-scroll">
        <LogConsole />
      </div>
    </div>
  );
}

function ActionList() {
  const { actions, addAction, setActions } = useActionStore();

  useEffect(() => {
    loadAction();
    return;
  }, []);

  async function loadAction() {
    const response = await fetch('http://localhost:5232/api/actions');
    if (response.status !== 200) {
      return;
    }

    const data: Action[] = await response.json();
    setActions(data);
  }

  async function createAction() {
    const response = await fetch('http://localhost:5232/api/actions', {
      method: 'POST',
    });
    if (response.status !== 200) {
      return;
    }

    const data: Action = await response.json();
    addAction(data);
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 overflow-y-auto bg-gray-100">
      {actions.length === 0 && <div>No actions</div>}
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
      <Button className="w-1/2" onClick={createAction}>
        <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-500 to-pink-500">
          Add new action
        </span>
      </Button>
    </div>
  );
}

export default App;
