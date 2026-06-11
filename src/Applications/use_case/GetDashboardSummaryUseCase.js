/**
 * Use Case untuk mengambil rangkuman data Dashboard.
 * Layer: Application
 */
export const makeGetDashboardSummaryUseCase = ({ dashboardRepository }) => {
  return async () => {
    return dashboardRepository.getSummary();
  };
};