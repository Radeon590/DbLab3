using EventsHubApi.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace EventsHubApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;

        public UsersController(ApplicationContext applicationContext) 
        {
            _applicationContext = applicationContext;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IResult> Create(string username, string useremail, string password, string firstname, string secondname, string patronymic, int age)
        {
            //
            User newUser = new User(username, useremail, password, firstname, secondname, patronymic, age);
            return await Create(newUser);
        }

        [HttpPost]
        [Route("CreateFromJson")]
        public async Task<IResult> Create()
        {
            User? newUser = await HttpContext.Request.ReadFromJsonAsync<User>();
            if (newUser != null) 
            {
                return await Create(newUser);
            }
            return Results.BadRequest("cant get user json from request body");
        }

        private async Task<IResult> Create(User user)
        {
            //check unique
            int countNotUnique = await _applicationContext.Users.Where(u => u.Username == user.Username || u.UserEmail == user.UserEmail).CountAsync();
            if (countNotUnique > 0)
            {
                return Results.Conflict("user with this username ot useremail is exists");
            }
            //
            await _applicationContext.Users.AddAsync(user);
            await _applicationContext.SaveChangesAsync();
            //TODO: check return id
            return Results.Ok(user.Id);
        }

        [HttpGet]
        [Route("Authorize")]
        public async Task<IResult> Authorize(string username, string password)
        {
            var user = await _applicationContext.Users.Where(u => u.Username == username && u.Password == password).FirstOrDefaultAsync();
            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, AuthRoles.User)
                };
                var claimsIdentity = new ClaimsIdentity(claims, "Cookies");
                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                return Results.SignIn(claimsPrincipal);
            }
            return Results.NotFound();
        }

        [HttpGet]
        [Route("NotAuthorized")]
        public IResult NotAuthorized()
        {
            return Results.StatusCode(401);
        }

        [HttpGet]
        [Route("Read")]
        [Authorize(Roles = AuthRoles.User)]
        public async Task<IResult> Read(int id)
        {
            User? user = await _applicationContext.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
            if (user != null)
            {
                return Results.Json(user);
            }
            return Results.NotFound();
        }

        [HttpGet]
        [Route("ReadByUsername")]
        [Authorize(Roles = AuthRoles.User)]
        public async Task<IResult> ReadByUsername(string username)
        {
            User? user = await _applicationContext.Users.Where(u => u.Username == username).FirstOrDefaultAsync();
            if (user != null)
            {
                return Results.Json(user);
            }
            return Results.NotFound();
        }

        [HttpGet]
        [Route("ReadEvents")]
        [Authorize(Roles = AuthRoles.User)]
        public async Task<IResult> ReadEvents(int id)
        {
            var user = await _applicationContext.Users.Include(u => u.Events).Where(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
            {
                return Results.NotFound("user not found");
            }
            return Results.Json(user.Events);
        }


        [HttpPatch]
        [Route("Update")]
        [Authorize(Roles = AuthRoles.User)]
        public async Task<IResult> Update(int id)
        {
            User? updateUser = await HttpContext.Request.ReadFromJsonAsync<User>();
            if (updateUser != null) 
            {
               // return Results.Json(_applicationContext.Users.Where(u => u.Id == id).FirstOrDefault());
                User? oldUser = await _applicationContext.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
                if (oldUser != null)
                {
                    oldUser.Username = updateUser.Username;
                    oldUser.UserEmail = updateUser.UserEmail;
                    oldUser.Password = updateUser.Password;
                    oldUser.FirstName = updateUser.FirstName;
                    oldUser.SecondName = updateUser.SecondName;
                    oldUser.Patronymic = updateUser.Patronymic;
                    oldUser.Age = updateUser.Age;
                    //
                    await _applicationContext.SaveChangesAsync();
                    return Results.Ok();
                }
                return Results.NotFound("old user not found");
            }
            return Results.BadRequest("cant get user from json body");
        }
    }
}
