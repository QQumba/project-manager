using System.Threading.Channels;
using Microsoft.AspNetCore.SignalR;

namespace ProjectManager.Api;

public class CommandOutputHub : Hub
{
    public async Task<ChannelReader<string>> StreamOutput()
    {
        throw new NotImplementedException();
    }
}