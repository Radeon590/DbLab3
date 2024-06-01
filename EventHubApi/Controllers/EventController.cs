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
        private readonly ILogger _logger;

        public EventController(ApplicationContext applicationContext, ILogger<EventController> logger)
        {
            _applicationContext = applicationContext;
            _logger = logger;
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
        [Route("ReadAll")]
        [Authorize(Roles = $"{AuthRoles.Organizer}, {AuthRoles.User}")]
        public async Task<IResult> ReadAll()
        {
            return Results.Json(await _applicationContext.Events.ToListAsync());
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

        [HttpGet]
        [Route("IsUserParticipant")]
        [Authorize(Roles = $"{AuthRoles.Organizer}, {AuthRoles.User}")]
        public async Task<IResult> IsUserParticipant(int eventId, int userId)
        {
            Event? resultEvent = await _applicationContext.Events.Include(e => e.Users).Where(e => e.Id == eventId).FirstOrDefaultAsync();
            if (resultEvent == null)
            {
                return Results.NotFound("event not found");
            }
            //
            return Results.Ok(resultEvent.Users.Where(u => u.Id == userId).Count() != 0);
        }

        [HttpPatch]
        [Route("AddUser")]
        [Authorize(Roles = AuthRoles.User)]
        public async Task<IResult> AddUser(int eventId, int userId)
        {
            _logger.LogInformation("addUser");
            _logger.LogDebug("read event");
            Event? resultEvent = await _applicationContext.Events.Include(e => e.Users).Where(e => e.Id == eventId).FirstOrDefaultAsync();
            if (resultEvent == null)
            {
                return Results.NotFound("event not found");
            }
            //
            _logger.LogDebug("read user");
            User? user = await _applicationContext.Users.Where(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null) 
            {
                return Results.NotFound("user not found");
            }
            //
            _logger.LogDebug("add user");
            if (resultEvent.Users == null)
            {
                resultEvent.Users = new List<User>() { user };
            }
            else
            {
                resultEvent?.Users?.Add(user);
            }
            await _applicationContext.SaveChangesAsync();
            return Results.Ok();
        }
    }
}
