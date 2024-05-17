using System.Text.Json.Serialization;

namespace EventsHubApi.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Namespace { get; set; }
        public string? Description { get; set; }
        public string Address { get; set; }
        public DateTime Date { get; set; }
        public float Price { get; set; }
        public int OrganizerId { get; set; }
        [JsonIgnore]
        public Organizer? Organizer { get; set; }
        [JsonIgnore]
        public List<User>? Users { get; set; }

        public Event() { }

        public Event(Organizer organizer, string namespacE, string description, string address, DateTime date, float price)
            : this(organizer, namespacE, description, address, date, price, new List<User>())
        {

        }

        public Event(Organizer organizer, string namespacE, string description, string address, DateTime date, float price, List<User> users)
        {
            Organizer = organizer;
            Namespace = namespacE;
            Description = description;
            Address = address;
            Date = date;
            Price = price;
            Users = users;
        }

        public Event(int organizerId, string namespacE, string description, string address, DateTime date, float price) 
            : this(organizerId, namespacE, description, address, date, price, new List<User>())
        {

        }

        public Event(int organizerId, string namespacE, string description, string address, DateTime date, float price, List<User> users)
        {
            OrganizerId = organizerId;
            Namespace = namespacE;
            Description = description;
            Address = address;
            Date = date;
            Price = price;
            Users = users;
        }
    }
}
