import {useQueries} from '@tanstack/react-query';
import {Account, Transaction, useGetTransactionsByPeriod} from "@/http/generated";
import {useMemo} from 'react';

export const useAccountsTransactions = (accounts: Account[]) => {
  const queries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ['transactions', account.id],
      queryFn: () => useGetTransactionsByPeriod({accountId: account.id!}, {
        page: 1,
        pageSize: 5,
        startDate: new Date(new Date().setDate(new Date().getDay() - 10)),
        endDate: new Date()
      }),
    }))
  });

  const transactions = useMemo(() => {
    const allTransactions: Transaction[] = [];
    queries.forEach(query => {
      if (query.data?.data?.data.items) {
        allTransactions.push(...query.data.data.data.items);
      }
    });

    // Sort transactions by date (most recent first)
    return allTransactions.sort((a, b) =>
      new Date(b.date!).getTime() - new Date(a.date!).getTime()
    );
  }, [queries]);

  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const errors = queries
    .filter(query => query.error)
    .map(query => query.error);

  return {
    transactions,
    isLoading,
    isError,
    errors,
    queries
  };
};
