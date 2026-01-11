using Microsoft.EntityFrameworkCore;
using ProjectManager.Api.Data.Models;

namespace ProjectManager.Api.Data;

public class ActionRunnerDbContext : DbContext
{
    public ActionRunnerDbContext(DbContextOptions<ActionRunnerDbContext> options) : base(options)
    {
    }

    public DbSet<ActionInfo> Actions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var actionBuilder = modelBuilder.Entity<ActionInfo>();

        actionBuilder.ToTable("actions");
        actionBuilder.HasKey(x => x.Id);
        actionBuilder.Property(x => x.Args)
            .HasColumnType("jsonb");
    }
}