namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryHandler : IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationSummaryHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<GetRegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        var allRegistrations = await _dbContext.Registrations
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        int totalRegistrations = allRegistrations.Count;
        int confirmed = allRegistrations.Count(r => r.Status == RegistrationStatus.Confirmed);
        int checkedIn = allRegistrations.Count(r => r.Status == RegistrationStatus.CheckedIn);
        int pending = allRegistrations.Count(r => r.Status == RegistrationStatus.Pending);
        int cancelled = allRegistrations.Count(r => r.Status == RegistrationStatus.Cancelled);

        // Cancelled registrations are excluded from the money totals per requirements
        var activeRegistrations = allRegistrations.Where(r => r.Status != RegistrationStatus.Cancelled).ToList();
        decimal totalFees = activeRegistrations.Sum(r => r.RegistrationFee);
        decimal totalPayments = activeRegistrations.Sum(r => r.AmountPaid);
        decimal uncollectedPayments = totalFees - totalPayments;

        var response = new GetRegistrationSummaryResponse(
            totalRegistrations,
            confirmed,
            checkedIn,
            pending,
            cancelled,
            totalFees,
            totalPayments,
            uncollectedPayments
        );

        return Result<GetRegistrationSummaryResponse>.Success(response);
    }
}
