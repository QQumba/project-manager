using CliWrap;
using ProjectManager.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddCors(o =>
{
    o.AddPolicy("ui", x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("ui");

app.MapHub<CommandOutputHub>("/logs");

app.MapPost("/run", async (RunCommandRequest request) =>
{
    var delegateTarget = PipeTarget.ToDelegate((line, ct) =>
    {
        Console.WriteLine(line);
        return Task.CompletedTask;
    });

    var commandSeparatorIndex = request.Command.IndexOf(' ');

    var command = Cli.Wrap(request.Command[..commandSeparatorIndex])
        .WithArguments(request.Command[(commandSeparatorIndex + 1)..])
        .WithWorkingDirectory(request.WorkingDirectory)
        .WithStandardOutputPipe(delegateTarget);

    await command.ExecuteAsync();
});

app.MapGet("/ping", () => "pong");

app.Run();