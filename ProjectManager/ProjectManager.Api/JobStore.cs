using System.Collections.Concurrent;

namespace ProjectManager.Api;

public class JobStore
{
    private readonly ConcurrentDictionary<Guid, Job> _jobs = new();

    public Job? GetJob(Guid jobId)
    {
        _jobs.TryGetValue(jobId, out var job);
        return job;
    }

    public void AddJob(Job job)
    {
        _jobs.TryAdd(job.Id, job);
    }
}