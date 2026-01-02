import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;

export function getConnection(): signalR.HubConnection {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5232/logs')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onclose((err) => {
      console.error('SignalR closed', err);
    });
  }

  return connection;
}

export async function startConnection() {
  const conn = getConnection();

  if (conn.state === signalR.HubConnectionState.Connected) {
    return;
  }

  if (!startPromise) {
    startPromise = conn.start().catch((err) => {
      startPromise = null;
      throw err;
    });
  }

  return startPromise;
}

export async function readLogs(
  jobId: string,
  onNext: (value: string) => void,
  onComplete: () => void,
  onError: () => void
) {
  const conn = getConnection();
  await startConnection();

  conn.stream<string>('StreamOutput', jobId).subscribe({
    next: function (value: string): void {
      onNext(value);
      console.log(value);
    },
    error: function (err: any): void {
      console.error(err);
      onError();
    },
    complete: function (): void {
      onComplete();
    },
  });
}
