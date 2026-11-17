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

        var lastRegistration = await _dbContext.Registrations
            .Where(r => r.RegistrationNumber.StartsWith("CS27-"))
            .OrderByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        int nextSeq = 1;
        if (!string.IsNullOrEmpty(lastRegistration) && lastRegistration.Length >= 9 &&
            int.TryParse(lastRegistration[5..], out int parsedSeq))
        {
            nextSeq = parsedSeq + 1;
        }
        else
        {
            int totalCount = await _dbContext.Registrations.CountAsync(cancellationToken);
            nextSeq = totalCount + 1;
        }

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
