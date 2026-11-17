namespace Application.Features.Registrations.GetRegistrations;

using Domain.Enums;
using FluentValidation;

public sealed class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("'Page' must be greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("'Page Size' must be between 1 and 50.");

        RuleFor(x => x.ParticipantName)
            .MaximumLength(150)
            .When(x => !string.IsNullOrEmpty(x.ParticipantName))
            .WithMessage("The length of 'Participant Name' must be 150 characters or fewer.");

        RuleFor(x => x.Type)
            .Must(t => string.IsNullOrWhiteSpace(t) || Enum.TryParse<RegistrationType>(t, true, out _))
            .WithMessage("Invalid registration type. Allowed values are: Exhibitor, Competitor, VIP.");

        RuleFor(x => x.Status)
            .Must(s => string.IsNullOrWhiteSpace(s) || Enum.TryParse<RegistrationStatus>(s, true, out _))
            .WithMessage("Invalid status. Allowed values are: Pending, Confirmed, CheckedIn, Cancelled.");
    }
}
