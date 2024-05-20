using EventsHubApi;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
#region CORS
var corsOrigins = builder.Configuration.GetSection("CorsAllowedOrigins").Get<string[]>();
CorsPolicyBuilder corsPolicyBuilder = new CorsPolicyBuilder();

if (corsOrigins != null)
    corsPolicyBuilder.WithOrigins(corsOrigins);
else
    throw new Exception("cant get cors policies config");

corsPolicyBuilder.AllowCredentials();
corsPolicyBuilder.AllowAnyHeader();
corsPolicyBuilder.WithMethods("GET", "POST", "PATCH");

builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(corsPolicyBuilder.Build());
});
#endregion
//
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => options.LoginPath = "/api/Users/NotAuthorized");
builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationContext>(options => options.UseMySql("server=localhost;user=root;password=root;database=usersdb;", 
    new MySqlServerVersion(new Version(8, 0, 25))));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();    

app.UseAuthorization();

app.MapControllers();

app.Run();
