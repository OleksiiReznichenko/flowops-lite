var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
   options.AddPolicy("Frontend", policy =>
   {
      policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
   });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "FlowOps API"
}));


app.Run();
