using System.Threading.Channels;

namespace ProjectManager.Api;

public class Job
{
    public Guid JobId { get; set; }
    public Channel<string> LoggingChannel { get; } = Channel.CreateBounded<string>(new BoundedChannelOptions(100)
    {
        FullMode = BoundedChannelFullMode.DropOldest
    });
}