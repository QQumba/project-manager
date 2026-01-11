using System.Text.Json;
using CliWrap;
using Microsoft.EntityFrameworkCore;
using ProjectManager.Api;
using ProjectManager.Api.Data;
using ProjectManager.Api.Data.Models;
using ProjectManager.Api.Requests;

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

builder.Services.AddDbContext<ActionRunnerDbContext>(o =>
{
    o.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"))
        .UseSnakeCaseNamingConvention();
});

var app = builder.Build();

app.UseCors("ui");

app.MapHub<CommandOutputHub>("/logs");

app.MapGet("/api/actions", async (ActionRunnerDbContext db) =>
{
    var actions = await db.Actions.ToListAsync();
    return Results.Ok(actions);
});

app.MapPost("/api/actions", async (ActionRunnerDbContext db) =>
{
    var newAction = new ActionInfo
    {
        Name = "New action",
        Command = string.Empty,
        Args = JsonDocument.Parse("{}")
    };
    var entityEntry = db.Actions.Add(newAction);
    await db.SaveChangesAsync();

    return Results.Ok(entityEntry.Entity);
});

app.MapPut("/api/actions/{actionId:long}", async (long actionId, UpdateActionRequest request, ActionRunnerDbContext db) =>
{
    var action = await db.Actions.FirstOrDefaultAsync(x => x.Id == actionId);
    if (action is null)
    {
        return Results.NotFound($"Action with id {actionId} not found");
    }

    action.Name = request.Name;
    action.Command = request.Command;
    action.WorkingDir = request.WorkingDir;
    action.Args = request.Args;

    db.Actions.Update(action);
    await db.SaveChangesAsync();

    return Results.Ok(action);
});

app.MapDelete("/api/actions/{actionId:long}", async (long actionId, ActionRunnerDbContext db) =>
{
    var rowsDeleted = await db.Actions.Where(x => x.Id == actionId).ExecuteDeleteAsync();
    if (rowsDeleted == 0)
    {
        return Results.NotFound($"Action with id {actionId} not found");
    }

    return Results.Ok();
});

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