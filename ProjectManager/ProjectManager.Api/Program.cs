using CliWrap;
using ProjectManager.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<JobStore>();
builder.Services.AddSignalR();
builder.Services.AddCors(o =>
{
    o.AddPolicy("ui", x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowed(_ => true)
    );
});

var app = builder.Build();

app.UseCors("ui");

app.MapHub<CommandOutputHub>("/logs");

app.MapPost("/run", (RunCommandRequest request, JobStore jobStore, ILogger<Program> logger) =>
{
    var commandSeparatorIndex = request.Command.IndexOf(' ');
    var exePath = request.Command[..commandSeparatorIndex];
    if (exePath.EndsWith(".exe"))
    {
        exePath = Path.Combine(request.WorkingDirectory, exePath);
        if (!File.Exists(exePath))
        {
            return Task.FromResult(Results.BadRequest("Provided .exe file does not exists inside the provided working directory"));
        }
    }

    var command = Cli.Wrap(exePath)
        .WithArguments(request.Command[(commandSeparatorIndex + 1)..])
        .WithWorkingDirectory(request.WorkingDirectory);

    var job = new Job(command);
    jobStore.AddJob(job);

    logger.LogInformation("Job with id {JobId} was created", job.Id);
    return Task.FromResult(Results.Ok(new RunCommandResponse
    {
        JobId = job.Id
    }));
});

app.MapGet("/ping", () => "pong");

app.Run();