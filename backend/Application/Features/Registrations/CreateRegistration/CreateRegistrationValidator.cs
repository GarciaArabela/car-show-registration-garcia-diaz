namespace Application.Features.Registrations.CreateRegistration;

using Domain.Entities;
using Domain.Enums;
using FluentValidation;

public sealed class CreateRegistrationValidator : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        RuleFor(x => x.ParticipantName)
            .NotEmpty().WithMessage("'Participant Name' must not be empty.")
            .MaximumLength(150).WithMessage("The length of 'Participant Name' must be 150 characters or fewer. You entered {TotalLength} characters.");

        RuleFor(x => x.ContactNumber)
            .NotEmpty().WithMessage("'Contact Number' must not be empty.")
            .Matches(@"^09\d{9}$").WithMessage("'Contact Number' must follow Philippine mobile format (09XXXXXXXXX with 11 digits).");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("'Email' must not be empty.")
            .EmailAddress().WithMessage("'Email' is not a valid email address.")
            .MaximumLength(200).WithMessage("'Email' must not exceed 200 characters.");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("'Address' must not be empty.")
            .MaximumLength(300).WithMessage("'Address' must not exceed 300 characters.");

        RuleFor(x => x.CarMakeModel)
            .NotEmpty().WithMessage("'Car Make Model' must not be empty.")
            .MaximumLength(100).WithMessage("'Car Make Model' must not exceed 100 characters.");

        RuleFor(x => x.PlateNumber)
            .NotEmpty().WithMessage("'Plate Number' must not be empty.")
            .MaximumLength(15).WithMessage("'Plate Number' must not exceed 15 characters.");

        RuleFor(x => x.RegistrationType)
            .IsInEnum().WithMessage("Invalid registration type. Allowed types: Exhibitor, Competitor, VIP.");

        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0m).WithMessage("'Amount Paid' must be 0 or more.")
            .Must((cmd, amountPaid) =>
            {
                if (!Enum.IsDefined(typeof(RegistrationType), cmd.RegistrationType))
                {
                    return true;
                }

                decimal maxFee = Registration.CalculateFee(cmd.RegistrationType);
                return amountPaid <= maxFee;
            })
            .WithMessage((cmd, _) =>
            {
                string feeFormatted = cmd.RegistrationType switch
                {
                    RegistrationType.Exhibitor => "1,500",
                    RegistrationType.Competitor => "2,500",
                    RegistrationType.VIP => "5,000",
                    _ => "fee"
                };
                return $"'Amount Paid' cannot be more than the fee ({feeFormatted})";
            });
    }
}
