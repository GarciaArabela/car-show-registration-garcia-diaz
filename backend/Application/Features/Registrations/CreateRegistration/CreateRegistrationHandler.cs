namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationHandler : ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>>
{
    private readonly IAppDbContext _dbContext;

    public CreateRegistrationHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CreateRegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var normalizedPlate = command.PlateNumber.Trim();

        var plateExists = await _dbContext.Registrations
            .AnyAsync(r => r.PlateNumber.ToUpper() == normalizedPlate.ToUpper(), cancellationToken);

        if (plateExists)
        {
            return Result<CreateRegistrationResponse>.Failure(
                Error.Conflict("Registration.Conflict", $"A registration with plate number '{command.PlateNumber}' already exists."));
        }

        var regNumbers = await _dbContext.Registrations
            .Where(r => r.RegistrationNumber.StartsWith("CS27-"))
            .Select(r => r.RegistrationNumber)
            .ToListAsync(cancellationToken);

        int maxSeq = 0;
        foreach (var num in regNumbers)
        {
            if (num.Length >= 9 && int.TryParse(num[5..], out int seq))
            {
                if (seq > maxSeq)
                {
                    maxSeq = seq;
                }
            }
        }

        int nextSeq = maxSeq > 0 ? maxSeq + 1 : await _dbContext.Registrations.CountAsync(cancellationToken) + 1;
        string registrationNumber = $"CS27-{nextSeq:D4}";
        decimal fee = Registration.CalculateFee(command.RegistrationType);

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = registrationNumber,
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = normalizedPlate,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = fee,
            AmountPaid = command.AmountPaid
        };

        _dbContext.Registrations.Add(registration);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new CreateRegistrationResponse(
            registration.Id,
            registration.RegistrationNumber,
            registration.RegistrationDate,
            registration.ParticipantName,
            registration.ContactNumber,
            registration.Email,
            registration.Address,
            registration.CarMakeModel,
            registration.PlateNumber,
            registration.RegistrationType,
            registration.Status,
            registration.RegistrationFee,
            registration.AmountPaid,
            registration.PaymentStatus
        );

        return Result<CreateRegistrationResponse>.Success(response);
    }
}
