namespace ProjectManager.Api;

public class RunCommandRequest
{
    public required string Command { get; set; }
    public required string WorkingDirectory { get; set; }
}