using System.Text.Json.Serialization;

namespace EventsHubApi.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string UserEmail { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string Patronymic { get; set; }
        public int Age { get; set; }
        [JsonIgnore]
        public List<Event>? Events { get; set; }

        public User() { }

        public User(string username, string useremail, string password, string firstName, string secondName, string patronymic, int age)
            : this(username, useremail, password, firstName, secondName, patronymic, age, new List<Event>())
        {
            
        }

        public User(string username, string useremail, string password, string firstName, string secondName, string patronymic, int age, List<Event> events)
        {
            Username = username;
            UserEmail = useremail;
            Password = password;
            FirstName = firstName;
            SecondName = secondName;
            Patronymic = patronymic;
            Age = age;
            Events = events;
        }
    }
}
