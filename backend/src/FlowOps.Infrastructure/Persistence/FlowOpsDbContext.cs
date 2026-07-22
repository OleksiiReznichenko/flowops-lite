using Microsoft.EntityFrameworkCore;

namespace FlowOps.Infrastructure.Persistence;

public sealed class FlowOpsDbContext(
    DbContextOptions<FlowOpsDbContext> options)
    : DbContext(options)
{

}
