using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Users.SearchUser;

internal sealed class SearchUserHandler(IPaymentsDbContext context) : IQueryHandler<SearchUserByEmailQuery, User>, IQueryHandler<SearchUserByCPFQuery, User>
{
    public async Task<Result<User>> Handle(SearchUserByEmailQuery request, CancellationToken cancellationToken)
    {
        User? user = await GetUserQuery()
            .Where(u => u.Email == request.Email)
            .FirstOrDefaultAsync(cancellationToken);

        return user is not null
            ? Result.Success(user)
            : Result.Failure<User>(UserErrors.NotFoundByEmail(request.Email));
    }

    public async Task<Result<User>> Handle(SearchUserByCPFQuery request, CancellationToken cancellationToken)
    {
        User? user = await GetUserQuery()
            .Where(u => u.CPF == request.CPF)
            .FirstOrDefaultAsync(cancellationToken);

        return user is not null
            ? Result.Success(user)
            : Result.Failure<User>(UserErrors.CPFNotFound(request.CPF));
    }

    private IQueryable<User> GetUserQuery()
    {
        return context.Users
            .Include(i => i.Accounts)
            .AsNoTracking();
    }
}
