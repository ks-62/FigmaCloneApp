//using SignalRChat.Hubs;
using Microsoft.AspNetCore.ResponseCompression;
using WebAppConvas.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

//For Blazor
builder.Services.AddServerSideBlazor();
builder.Services.AddSignalR();

//For sigalR and Blazor
builder.Services.AddResponseCompression(opts =>
{
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] { "application/octet-stream" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

//For signalR and Blazor
app.UseResponseCompression();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

//For Blazor
app.MapBlazorHub();

app.MapHub<CanvasHub>("/canvasHub");
app.MapHub<ChatHub>("/chathub");

app.Run();
