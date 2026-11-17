namespace Api.Features.Registrations;

using Api.Common.Extensions;
using Api.Common.Filters;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;
using Microsoft.AspNetCore.Mvc;

public static class RegistrationEndpoints
{
    public static IEndpointRouteBuilder MapRegistrationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/registrations")
            .WithTags("Registrations");

        // POST /api/registrations
        group.MapPost("/", async (
            [FromBody] CreateRegistrationCommand command,
            ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(command, cancellationToken);
            return result.IsSuccess && result.Value is not null
                ? TypedResults.Created($"/api/registrations/{result.Value.Id}", result.Value)
                : result.ToProblemDetails();
        })
        .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
        .WithName("CreateRegistration")
        .WithSummary("Make a new registration");

        // GET /api/registrations/summary (Defined before {id:guid} to prevent conflict)
        group.MapGet("/summary", async (
            IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(new GetRegistrationSummaryQuery(), cancellationToken);
            return result.IsSuccess
                ? TypedResults.Ok(result.Value)
                : result.ToProblemDetails();
        })
        .WithName("GetRegistrationSummary")
        .WithSummary("KPI totals for the dashboard");

        // GET /api/registrations
        group.MapGet("/", async (
            [AsParameters] GetRegistrationsQuery query,
            IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(query, cancellationToken);
            return result.IsSuccess
                ? TypedResults.Ok(result.Value)
                : result.ToProblemDetails();
        })
        .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>()
        .WithName("GetRegistrations")
        .WithSummary("Show all registrations (paged, filtered)");

        // GET /api/registrations/{id:guid}
        group.MapGet("/{id:guid}", async (
            Guid id,
            IQueryHandler<GetRegistrationByIdQuery, Result<GetRegistrationByIdResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(new GetRegistrationByIdQuery(id), cancellationToken);
            return result.IsSuccess
                ? TypedResults.Ok(result.Value)
                : result.ToProblemDetails();
        })
        .WithName("GetRegistrationById")
        .WithSummary("Find registration by ID");

        return app;
    }
}
