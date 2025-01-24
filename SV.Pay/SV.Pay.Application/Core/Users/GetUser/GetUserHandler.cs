using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Users.GetUser;

internal sealed class GetUserHandler(IPaymentsDbContext context) : IQueryHandler<GetUserByEmailQuery, User>, IQueryHandler<GetUserByCPFQuery, User>
{
    public async Task<Result<User>> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        User? user = await GetUserQuery()
            .Where(u => u.Email == request.Email)
            .FirstOrDefaultAsync(cancellationToken);

        return user is not null
            ? Result.Success(user)
            : Result.Failure<User>(UserErrors.NotFoundByEmail);
    }

    public async Task<Result<User>> Handle(GetUserByCPFQuery request, CancellationToken cancellationToken)
    {
        User? user = await GetUserQuery()
            .Where(u => u.CPF == request.CPF)
            .FirstOrDefaultAsync(cancellationToken);

        return user is not null
            ? Result.Success(user)
            : Result.Failure<User>(UserErrors.CPFNotFound);
    }

    private IQueryable<User> GetUserQuery()
    {
        return context.Users
            .Include(i => i.Accounts)
            .AsNoTracking();
    }
}
