using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Users.Create;

internal sealed class CreateUserHandler(
    IPaymentsDbContext context) : ICommandHandler<CreateUserCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        bool emailExists = await context.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (emailExists)
            return Result.Failure<Guid>(UserErrors.EmailNotUnique);

        CPF cpf = new(request.CPF);
        bool cpfExists = await context.Users.AnyAsync(x => x.CPF == cpf, cancellationToken);
        if (cpfExists)
            return Result.Failure<Guid>(UserErrors.CPFNotUnique);

        User user = new()
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            BirthDate = DateOnly.FromDateTime(request.DateOfBirth),
            CPF = cpf
        };

        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}
