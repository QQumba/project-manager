import ActionCard from './components/action-card';

function App() {
  return (
    <div className="font-mono">
      <div className="flex flex-col items-center w-full">
        <ProjectCard name="Project 1"></ProjectCard>
      </div>
    </div>
  );
}

type ProjectCardProps = { name: string };

function ProjectCard({ name }: ProjectCardProps) {
  return (
    <div className="p-4 min-w-3xl">
      <h2 className="text-xl">{name}</h2>
      <div className="mt-2 flex flex-col gap-4">
        <ActionCard
          title="Pack"
          defaultCommand="dotnet pack --version-suffix {version} -o {output}"
          defaultWorkingDir="C:/git/project-manager/ProjectManager"
        />
        <ActionCard
          title="Run Chrome"
          defaultCommand="chrome.exe --remote-debugging-port={port} --user-data-dir=/tmp/chrome-debug-profile"
          defaultWorkingDir="C:/Program Files/Google/Chrome/Application/"
        />
      </div>
    </div>
  );
}

export default App;
