using CliWrap;
using FluentAssertions;
using ProjectManager.Api;

namespace ProjectManager.Test;

public class Tests
{
    [SetUp]
    public void Setup()
    {
        
    }

    [Test]
    public async Task Test1()
    {
        var request = new RunCommandRequest
        {
            Command = "chrome.exe --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-profile",
            WorkingDirectory = "C:/Program Files/Google/Chrome/Application/"
        };

        var commandSeparatorIndex = request.Command.IndexOf(' ');
        var exePath = request.Command[..commandSeparatorIndex];
        if (exePath.EndsWith(".exe"))
        {
            exePath = Path.Combine(request.WorkingDirectory, exePath);
            var fileExists = File.Exists(exePath);
            fileExists.Should().BeTrue();
        }

        var command = Cli.Wrap(exePath)
            .WithArguments(request.Command[(commandSeparatorIndex + 1)..])
            .WithWorkingDirectory(request.WorkingDirectory);


        // using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        // await command.ExecuteAsync(cts.Token);

        _ = command.ExecuteAsync();
    }
}