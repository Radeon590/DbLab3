using EventsHubApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventsHubApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizerController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;
        private readonly ILogger _logger;

        public OrganizerController(ApplicationContext applicationContext, ILogger<OrganizerController> logger)
        {
            _applicationContext = applicationContext;
            _logger = logger;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IResult> Create([FromBody] Organizer organizer)
        {
            if (_applicationContext.Organizers.Where(o => o.PublicNamespace == organizer.PublicNamespace && o.FullNamespace == organizer.FullNamespace).Count() > 0)
            {
                return Results.Conflict("organizer is not unique");
            }
            _applicationContext.Organizers.Add(organizer);
            await _applicationContext.SaveChangesAsync();
            return Results.Ok(organizer.Id);
        }

        [HttpGet]
        [Route("Authorize")]
        public async Task<IResult> Authorize(string publicNamespace, string password)
        {
            var organizer = await _applicationContext.Organizers.Where(o => o.PublicNamespace == publicNamespace && o.Password == password).FirstOrDefaultAsync();
            if (organizer != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, publicNamespace),
                    new Claim(ClaimTypes.Role, AuthRoles.Organizer)
                };
                var claimsIdentity = new ClaimsIdentity(claims, "Cookies");
                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                return Results.SignIn(claimsPrincipal);
            }
            return Results.NotFound();
        }

        [HttpGet]
        [Route("Read")]
        [Authorize(Roles = AuthRoles.Organizer)]
        public async Task<IResult> Read(int organizerId)
        {
            Organizer? organizer = await _applicationContext.Organizers.Where(o => o.Id == organizerId).FirstOrDefaultAsync();
            if (organizer == null)
            {
                return Results.NotFound("organizer not found");
            }
            //
            return Results.Json(organizer);
        }

        [HttpGet]
        [Route("ReadByNamespace")]
        [Authorize(Roles = AuthRoles.Organizer)]
        public async Task<IResult> Read(string publicNamespace)
        {
            Organizer? organizer = await _applicationContext.Organizers.Where(o => o.PublicNamespace == publicNamespace).FirstOrDefaultAsync();
            if (organizer == null)
            {
                return Results.NotFound("organizer not found");
            }
            //
            return Results.Json(organizer);
        }

        [HttpGet]
        [Route("ReadEvents")]
        [Authorize(Roles = AuthRoles.Organizer)]
        public async Task<IResult> ReadFull(int organizerId)
        {
            Organizer? organizer = await _applicationContext.Organizers.Include(o => o.Events).Where(o => o.Id == organizerId).FirstOrDefaultAsync();
            if (organizer == null)
            {
                return Results.NotFound("organizer not found");
            }
            //
            return Results.Json(organizer.Events);
        }

        /*[HttpPatch]
        [Route("AddEvent")]
        public async Task<IResult> AddEvent(int organizerId, int eventId)
        {
            Organizer? organizer = await _applicationContext.Organizers.Include(o => o.Events).Where(o => o.Id == organizerId).FirstOrDefaultAsync();
            if (organizer == null)
            {
                return Results.NotFound("organizer not found");
            }
            //
            Event? newEvent = await _applicationContext.Events.Where(e => e.Id == eventId).FirstOrDefaultAsync();
            if (newEvent == null)
            {
                return Results.NotFound("event not found");
            }
            //
            organizer.Events!.Add(newEvent);
            await _applicationContext.SaveChangesAsync();
            return Results.Ok();
        }*/

        [HttpDelete]
        [Route("Delete")]
        [Authorize(Roles = AuthRoles.Organizer)]
        public async Task<IResult> Delete(int organizerId)
        {
            Organizer? organizer = await _applicationContext.Organizers.Where(o => o.Id == organizerId).FirstOrDefaultAsync();
            if (organizer == null)
            {
                return Results.NotFound("organizer not found");
            }
            _applicationContext.Organizers.Remove(organizer);
            return Results.Ok();
        }
    }
}
