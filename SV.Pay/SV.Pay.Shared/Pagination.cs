namespace SV.Pay.Shared;

public record Pagination<T>(IReadOnlyList<T> Items, int TotalCount, int Page, int PageSize = 100)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
