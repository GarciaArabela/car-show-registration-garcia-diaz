namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsHandler : IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationsHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<GetRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var dbQuery = _dbContext.Registrations.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var search = query.ParticipantName.Trim().ToLower();
            dbQuery = dbQuery.Where(r => r.ParticipantName.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Type) &&
            Enum.TryParse<RegistrationType>(query.Type, true, out var regType))
        {
            dbQuery = dbQuery.Where(r => r.RegistrationType == regType);
        }

        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<RegistrationStatus>(query.Status, true, out var regStatus))
        {
            dbQuery = dbQuery.Where(r => r.Status == regStatus);
        }

        int totalCount = await dbQuery.CountAsync(cancellationToken);
        int totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling((double)totalCount / query.PageSize);

        var items = await dbQuery
            .OrderByDescending(r => r.RegistrationDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(r => new RegistrationItemDto(
                r.Id,
                r.RegistrationNumber,
                r.RegistrationDate,
                r.ParticipantName,
                r.ContactNumber,
                r.Email,
                r.Address,
                r.CarMakeModel,
                r.PlateNumber,
                r.RegistrationType,
                r.Status,
                r.RegistrationFee,
                r.AmountPaid,
                r.AmountPaid <= 0m ? "Unpaid" : (r.AmountPaid < r.RegistrationFee ? "Partial" : "Paid")
            ))
            .ToListAsync(cancellationToken);

        var response = new GetRegistrationsResponse(
            items,
            query.Page,
            query.PageSize,
            totalCount,
            totalPages
        );

        return Result<GetRegistrationsResponse>.Success(response);
    }
}
