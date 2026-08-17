import { useState } from 'react';

export interface DashboardFilters {
  period: string;
  agent: string;
}

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>({
    period: '30',
    agent: 'all',
  });

  const setPeriod = (period: string) => setFilters((prev) => ({ ...prev, period }));
  const setAgent = (agent: string) => setFilters((prev) => ({ ...prev, agent }));

  return { filters, setPeriod, setAgent };
}
