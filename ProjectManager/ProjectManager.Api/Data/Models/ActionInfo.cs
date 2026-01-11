using System.Text.Json;

namespace ProjectManager.Api.Data.Models;

public class ActionInfo
{
    public long Id { get; set; }    
    public required string Name { get; set; }    
    public required string Command { get; set; }    
    public string? WorkingDir { get; set; }
    public required JsonDocument Args { get; set; }
}