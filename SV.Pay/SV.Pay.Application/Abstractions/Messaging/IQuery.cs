using MediatR;
using SV.Pay.Shared;

namespace SV.Pay.Application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<Result<TResponse>>;
