namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Registrations.AnyAsync())
        {
            return;
        }

        var registrations = new List<Registration>
        {
            // 1. Juan Dela Cruz (Sample from PDF contract) - Competitor, Confirmed, Partial
            new()
            {
                Id = Guid.Parse("3f2c9a1e-8765-4321-9abc-0123456789ab"),
                RegistrationNumber = "CS27-0001",
                RegistrationDate = new DateTime(2026, 11, 1, 8, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Juan Dela Cruz",
                ContactNumber = "09171234567",
                Email = "juan@example.com",
                Address = "123 Rizal St., Naga City",
                CarMakeModel = "Toyota Supra MK4",
                PlateNumber = "ABC 1234",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 2500.00m,
                AmountPaid = 1000.00m
            },

            // 2. Exhibitor, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0002",
                RegistrationDate = new DateTime(2026, 11, 1, 9, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Maria Santos",
                ContactNumber = "09181112233",
                Email = "maria.santos@gmail.com",
                Address = "45 Magsaysay Ave., Sorsogon City",
                CarMakeModel = "Mazda RX-7 FD",
                PlateNumber = "NBD 2341",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 1500.00m,
                AmountPaid = 1500.00m
            },

            // 3. Exhibitor, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0003",
                RegistrationDate = new DateTime(2026, 11, 2, 9, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Carlos Mendoza",
                ContactNumber = "09192223344",
                Email = "carlos.mendoza@yahoo.com",
                Address = "12 Burgos St., Legazpi City",
                CarMakeModel = "Nissan Silvia S15",
                PlateNumber = "CAE 5678",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 1500.00m,
                AmountPaid = 1500.00m
            },

            // 4. Exhibitor, CheckedIn, Partial
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0004",
                RegistrationDate = new DateTime(2026, 11, 2, 10, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Mark Anthony Diaz",
                ContactNumber = "09203334455",
                Email = "mark.diaz@gmail.com",
                Address = "88 Quezon St., Sorsogon City",
                CarMakeModel = "Honda Civic EK9 Type R",
                PlateNumber = "NDB 9012",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.CheckedIn,
                RegistrationFee = 1500.00m,
                AmountPaid = 1000.00m
            },

            // 5. Exhibitor, CheckedIn, Partial
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0005",
                RegistrationDate = new DateTime(2026, 11, 3, 10, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Ana Patricia Reyes",
                ContactNumber = "09214445566",
                Email = "ana.reyes@outlook.com",
                Address = "15 Peñaranda St., Legazpi City",
                CarMakeModel = "Subaru WRX STI",
                PlateNumber = "EAA 3456",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.CheckedIn,
                RegistrationFee = 1500.00m,
                AmountPaid = 500.00m
            },

            // 6. Exhibitor, Pending, Unpaid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0006",
                RegistrationDate = new DateTime(2026, 11, 3, 11, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Paolo Gutierrez",
                ContactNumber = "09225556677",
                Email = "paolo.g@gmail.com",
                Address = "67 Alegre St., Sorsogon City",
                CarMakeModel = "Mitsubishi Lancer Evolution IX",
                PlateNumber = "WXZ 7891",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.Pending,
                RegistrationFee = 1500.00m,
                AmountPaid = 0.00m
            },

            // 7. Exhibitor, Pending, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0007",
                RegistrationDate = new DateTime(2026, 11, 4, 11, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Grace Fernandez",
                ContactNumber = "09236667788",
                Email = "grace.f@yahoo.com",
                Address = "23 Flores St., Sorsogon City",
                CarMakeModel = "Ford Mustang GT",
                PlateNumber = "NEB 1122",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.Pending,
                RegistrationFee = 1500.00m,
                AmountPaid = 1500.00m
            },

            // 8. Competitor, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0008",
                RegistrationDate = new DateTime(2026, 11, 5, 8, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Christian Bautista",
                ContactNumber = "09247778899",
                Email = "christian.b@gmail.com",
                Address = "55 Sampaguita St., Daraga, Albay",
                CarMakeModel = "Nissan GT-R R35",
                PlateNumber = "CBD 3344",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 2500.00m,
                AmountPaid = 2500.00m
            },

            // 9. Competitor, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0009",
                RegistrationDate = new DateTime(2026, 11, 5, 8, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Angela Nicole Ramos",
                ContactNumber = "09258889900",
                Email = "angela.ramos@gmail.com",
                Address = "78 Rizal Ave., Sorsogon City",
                CarMakeModel = "BMW M3 E46",
                PlateNumber = "NAA 5566",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 2500.00m,
                AmountPaid = 2500.00m
            },

            // 10. Competitor, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0010",
                RegistrationDate = new DateTime(2026, 11, 6, 9, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Jerome Castillo",
                ContactNumber = "09269990011",
                Email = "jerome.c@outlook.com",
                Address = "34 Roxas St., Naga City",
                CarMakeModel = "Toyota GR Yaris",
                PlateNumber = "EAB 7788",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 2500.00m,
                AmountPaid = 2500.00m
            },

            // 11. Competitor, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0011",
                RegistrationDate = new DateTime(2026, 11, 6, 9, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Gabriel Navarro",
                ContactNumber = "09271113355",
                Email = "gabriel.n@gmail.com",
                Address = "99 Garcia St., Sorsogon City",
                CarMakeModel = "Honda S2000 AP2",
                PlateNumber = "NFG 9900",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 2500.00m,
                AmountPaid = 2500.00m
            },

            // 12. Competitor, CheckedIn, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0012",
                RegistrationDate = new DateTime(2026, 11, 7, 10, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Kristine Joy Flores",
                ContactNumber = "09282224466",
                Email = "kristine.f@yahoo.com",
                Address = "14 Mabini St., Legazpi City",
                CarMakeModel = "Porsche Cayman 718",
                PlateNumber = "CAF 2233",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.CheckedIn,
                RegistrationFee = 2500.00m,
                AmountPaid = 2500.00m
            },

            // 13. Competitor, CheckedIn, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0013",
                RegistrationDate = new DateTime(2026, 11, 7, 10, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Dennis Michael Tan",
                ContactNumber = "09293335577",
                Email = "dennis.tan@gmail.com",
                Address = "82 Magsaysay St., Sorsogon City",
                CarMakeModel = "Chevrolet Corvette C8",
                PlateNumber = "NBA 4455",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.CheckedIn,
                RegistrationFee = 2500.00m,
                AmountPaid = 2500.00m
            },

            // 14. Competitor, Pending, Unpaid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0014",
                RegistrationDate = new DateTime(2026, 11, 8, 11, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Rafael Villanueva",
                ContactNumber = "09304446688",
                Email = "rafael.v@gmail.com",
                Address = "19 San Juan St., Daraga, Albay",
                CarMakeModel = "Toyota GR86",
                PlateNumber = "EAC 6677",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Pending,
                RegistrationFee = 2500.00m,
                AmountPaid = 0.00m
            },

            // 15. Competitor, Pending, Partial
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0015",
                RegistrationDate = new DateTime(2026, 11, 8, 11, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Bea Bianca Soriano",
                ContactNumber = "09315557799",
                Email = "bea.soriano@yahoo.com",
                Address = "50 Bonifacio St., Sorsogon City",
                CarMakeModel = "Subaru BRZ",
                PlateNumber = "NCD 8899",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Pending,
                RegistrationFee = 2500.00m,
                AmountPaid = 500.00m
            },

            // 16. Competitor, Pending, Unpaid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0016",
                RegistrationDate = new DateTime(2026, 11, 9, 8, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Joshua David Perez",
                ContactNumber = "09326668800",
                Email = "joshua.perez@gmail.com",
                Address = "27 Luna St., Naga City",
                CarMakeModel = "Nissan 370Z Nismo",
                PlateNumber = "CAG 1133",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Pending,
                RegistrationFee = 2500.00m,
                AmountPaid = 0.00m
            },

            // 17. Competitor, Pending, Unpaid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0017",
                RegistrationDate = new DateTime(2026, 11, 9, 8, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Camille Joy Aquino",
                ContactNumber = "09337779911",
                Email = "camille.a@gmail.com",
                Address = "63 Burgos St., Sorsogon City",
                CarMakeModel = "Audi TT RS",
                PlateNumber = "NEE 2244",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Pending,
                RegistrationFee = 2500.00m,
                AmountPaid = 0.00m
            },

            // 18. VIP, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0018",
                RegistrationDate = new DateTime(2026, 11, 10, 9, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Alexander James Sy",
                ContactNumber = "09348880022",
                Email = "alex.sy@syholdings.ph",
                Address = "100 Peñafrancia Ave., Naga City",
                CarMakeModel = "Ferrari 488 Pista",
                PlateNumber = "VIP 8888",
                RegistrationType = RegistrationType.VIP,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 5000.00m,
                AmountPaid = 5000.00m
            },

            // 19. VIP, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0019",
                RegistrationDate = new DateTime(2026, 11, 10, 9, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Samantha Mae Co",
                ContactNumber = "09359991133",
                Email = "sam.co@gmail.com",
                Address = "88 Diversion Rd., Sorsogon City",
                CarMakeModel = "Lamborghini Huracan EVO",
                PlateNumber = "VIP 7777",
                RegistrationType = RegistrationType.VIP,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 5000.00m,
                AmountPaid = 5000.00m
            },

            // 20. VIP, Confirmed, Paid
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0020",
                RegistrationDate = new DateTime(2026, 11, 11, 10, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Richard Francis Gomez",
                ContactNumber = "09361112244",
                Email = "richard.gomez@yahoo.com",
                Address = "42 Imperial St., Legazpi City",
                CarMakeModel = "McLaren 720S",
                PlateNumber = "VIP 9999",
                RegistrationType = RegistrationType.VIP,
                Status = RegistrationStatus.Confirmed,
                RegistrationFee = 5000.00m,
                AmountPaid = 5000.00m
            },

            // 21. VIP, CheckedIn, Partial
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0021",
                RegistrationDate = new DateTime(2026, 11, 11, 10, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Victoria Elizabeth Tan",
                ContactNumber = "09372223355",
                Email = "victoria.tan@corp.ph",
                Address = "11 Bicol Blvd., Sorsogon City",
                CarMakeModel = "Porsche 911 GT3 RS",
                PlateNumber = "VIP 6666",
                RegistrationType = RegistrationType.VIP,
                Status = RegistrationStatus.CheckedIn,
                RegistrationFee = 5000.00m,
                AmountPaid = 3000.00m
            },

            // 22. VIP, CheckedIn, Partial
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0022",
                RegistrationDate = new DateTime(2026, 11, 12, 11, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Dominic Edward Lim",
                ContactNumber = "09383334466",
                Email = "dominic.lim@limmotors.com",
                Address = "77 Airport Rd., Legazpi City",
                CarMakeModel = "Aston Martin Vantage",
                PlateNumber = "VIP 5555",
                RegistrationType = RegistrationType.VIP,
                Status = RegistrationStatus.CheckedIn,
                RegistrationFee = 5000.00m,
                AmountPaid = 1500.00m
            },

            // 23. Exhibitor, Cancelled (Excluded from money totals per Case 36)
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0023",
                RegistrationDate = new DateTime(2026, 11, 13, 8, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Ramon Santiago",
                ContactNumber = "09394445577",
                Email = "ramon.santiago@gmail.com",
                Address = "31 Del Rosario St., Sorsogon City",
                CarMakeModel = "Volkswagen Golf R",
                PlateNumber = "CAN 1001",
                RegistrationType = RegistrationType.Exhibitor,
                Status = RegistrationStatus.Cancelled,
                RegistrationFee = 1500.00m,
                AmountPaid = 0.00m
            },

            // 24. Competitor, Cancelled (Excluded from money totals per Case 36)
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0024",
                RegistrationDate = new DateTime(2026, 11, 13, 8, 30, 0, DateTimeKind.Utc),
                ParticipantName = "Enrique Lorenzo",
                ContactNumber = "09405556688",
                Email = "enrique.l@yahoo.com",
                Address = "18 Vinzons Ave., Daet, Camarines Norte",
                CarMakeModel = "Honda Civic Type R FL5",
                PlateNumber = "CAN 2002",
                RegistrationType = RegistrationType.Competitor,
                Status = RegistrationStatus.Cancelled,
                RegistrationFee = 2500.00m,
                AmountPaid = 1000.00m
            },

            // 25. VIP, Cancelled (Excluded from money totals per Case 36)
            new()
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = "CS27-0025",
                RegistrationDate = new DateTime(2026, 11, 14, 9, 0, 0, DateTimeKind.Utc),
                ParticipantName = "Sebastian Lee",
                ContactNumber = "09416667799",
                Email = "sebastian.lee@gmail.com",
                Address = "90 Capitol Complex, Cadlan, Pili",
                CarMakeModel = "Mercedes-AMG GT R",
                PlateNumber = "CAN 3003",
                RegistrationType = RegistrationType.VIP,
                Status = RegistrationStatus.Cancelled,
                RegistrationFee = 5000.00m,
                AmountPaid = 2500.00m
            }
        };

        await context.Registrations.AddRangeAsync(registrations);
        await context.SaveChangesAsync();
    }
}
