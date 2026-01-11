using System.Text;
using System.Threading.Channels;
using CliWrap;

namespace ProjectManager.Api;

public class Job
{
    private readonly Command _command;

    public Job(Command command)
    {
        _command = command;
    }

    public Guid Id { get; } = Guid.NewGuid();
    public Channel<string> LoggingChannel { get; } = Channel.CreateBounded<string>(new BoundedChannelOptions(100)
    {
        FullMode = BoundedChannelFullMode.DropOldest
    });

    public async Task Run(CancellationToken cancellationToken)
    {
        var target = PipeTarget.ToDelegate(async (line, ct) =>
        {
            await LoggingChannel.Writer.WriteAsync(line, ct);
        });

        try
        {
            await _command
                .WithStandardOutputPipe(target)
                .WithStandardErrorPipe(target)
                .ExecuteAsync(cancellationToken);
        }
        catch (Exception e)
        {
            LoggingChannel.Writer.TryComplete(e);
        }
        finally
        {
            LoggingChannel.Writer.TryComplete();
        }
    }
}