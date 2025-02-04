import {Account, getTransactionsByPeriod, Transaction} from "@/http/generated";
import {useQueries} from "@tanstack/react-query";
import {useMemo} from "react";

export const useAccountsTransactions = (accounts: Account[]) => {
  const queries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ['transactions', account.id],
      queryFn: () =>
        getTransactionsByPeriod(
          { accountId: account.id! },
          {
            page: 1,
            pageSize: 10,
            startDate: new Date(new Date().setUTCDate(new Date().getUTCDate() - 10)),
            endDate: new Date(),
          }
        ),
    })),
  });

  const transactionsMemo = useMemo(() => {
    const allTransactions: Transaction[] = [];
    queries.forEach((query) => {
      if (query.data?.data.items) {
        allTransactions.push(...query.data.data.items);
      }
    });
    return allTransactions.sort(
      (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
    );
  }, [queries]);

  // check for duplicates
  const seen = new Set();
  const transactions = transactionsMemo.filter((transaction) => {
    const duplicate = seen.has(transaction.id);
    seen.add(transaction.id);
    return !duplicate;
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const errors = queries.filter((query) => query.error).map((query) => query.error);

  return {
    transactions,
    isLoading,
    isError,
    errors,
    queries,
  };
};
