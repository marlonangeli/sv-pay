using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Users.GetById;

internal sealed class GetUserByIdHandler(IPaymentsDbContext context) : IQueryHandler<GetUserByIdQuery, User>
{
    public async Task<Result<User>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        User? user = await context.Users
            .AsNoTracking()
            .Include(i => i.Accounts)
            .Where(u => u.Id == request.UserId)
            .FirstOrDefaultAsync(cancellationToken);

        return user is not null
            ? Result.Success(user)
            : Result.Failure<User>(UserErrors.NotFound(request.UserId));
    }
}
