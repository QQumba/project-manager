using System.Threading.Channels;
using Microsoft.AspNetCore.SignalR;

namespace ProjectManager.Api;

public class CommandOutputHub : Hub
{
    private readonly ILogger<CommandOutputHub> _logger;
    private readonly JobStore _jobStore;

    public CommandOutputHub(ILogger<CommandOutputHub> logger, JobStore jobStore)
    {
        _logger = logger;
        _jobStore = jobStore;
    }

    public Task<ChannelReader<string>> StreamOutput(Guid jobId, CancellationToken cancellationToken)
    {
        var job = _jobStore.GetJob(jobId);
        if (job is null)
        {
            throw new Exception();
        }

        _ = job.Run(cancellationToken);
        
        return Task.FromResult(job.LoggingChannel.Reader);
    }

    public Task Ping()
    {
        _logger.LogInformation("pong");
        return Task.CompletedTask;
    }
}