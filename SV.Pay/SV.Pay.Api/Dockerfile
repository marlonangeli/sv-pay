FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SV.Pay.Api/SV.Pay.Api.csproj", "SV.Pay.Api/"]
RUN dotnet restore "SV.Pay.Api/SV.Pay.Api.csproj"
COPY . .
WORKDIR "/src/SV.Pay.Api"
RUN dotnet build "SV.Pay.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "SV.Pay.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SV.Pay.Api.dll"]
