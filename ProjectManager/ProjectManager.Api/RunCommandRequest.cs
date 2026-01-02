namespace ProjectManager.Api;

public class RunCommandRequest
{
    public required string Command { get; set; }
    public required string WorkingDirectory { get; set; }
}

public class RunCommandResponse
{
    public Guid JobId { get; set; }
}