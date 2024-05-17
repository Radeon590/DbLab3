using EventsHubApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventsHubApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;

        public EventController(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }

        [HttpPost]
        [Route("Create")]
        [Authorize(Roles = AuthRoles.Organizer)]
        public async Task<IResult> Create([FromBody] Event newEvent)
        {
            _applicationContext.Events.Add(newEvent);
            await _applicationContext.SaveChangesAsync();
            return Results.Ok(newEvent.Id);
        }

        [HttpGet]
        [Route("Read")]
        [Authorize(Roles = $"{AuthRoles.Organizer}, {AuthRoles.User}")]
        public async Task<IResult> Read(int eventId)
        {
            Event? resultEvent = await _applicationContext.Events.Where(e => e.Id == eventId).FirstOrDefaultAsync();
            if(resultEvent == null)
            {
                return Results.NotFound("event not found");
            }
            //
            return Results.Json(resultEvent);
        }

        [HttpGet]
        [Route("ReadOrganizer")]
        [Authorize(Roles = $"{AuthRoles.Organizer}, {AuthRoles.User}")]
        public async Task<IResult> ReadOrganizer(int eventId)
        {
            Event? resultEvent = await _applicationContext.Events.Include(e => e.Organizer).Where(e => e.Id == eventId).FirstOrDefaultAsync();
            if (resultEvent == null)
            {
                return Results.NotFound("event not found");
            }
            //
            return Results.Json(resultEvent.Organizer);
        }

        [HttpGet]
        [Route("ReadUsers")]
        [Authorize(Roles = $"{AuthRoles.Organizer}, {AuthRoles.User}")]
        public async Task<IResult> ReadUsers(int eventId)
        {
            Event? resultEvent = await _applicationContext.Events.Include(e => e.Users).Where(e => e.Id == eventId).FirstOrDefaultAsync();
            if (resultEvent == null)
            {
                return Results.NotFound("event not found");
            }
            //
            return Results.Json(resultEvent.Users);
        }
    }
}
