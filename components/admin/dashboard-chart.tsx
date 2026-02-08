'use client';

import { Bar } from 'react-chartjs-2';
import { registerChartJS } from '@/lib/utils/chart';
import { useDashboardStats } from '@/lib/api/queries/dashboard';

registerChartJS();

export function DashboardChart() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <div>Loading...</div>;
  if (error || !stats) return <div>ไม่สามารถโหลดข้อมูลรายได้</div>;
  if (!Array.isArray(stats.monthlyRevenue)) {
    return <div>ข้อมูลรายได้ไม่ถูกต้อง (monthlyRevenue missing)</div>;
  }

  const monthlyRevenue = Array.isArray(stats.monthlyRevenue) ? stats.monthlyRevenue : [];
  const labels = monthlyRevenue.map(m => {
    const [year, month] = m.month.split('-');
    const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${thMonths[parseInt(month, 10) - 1]} ${year}`;
  });
  const data = {
    labels,
    datasets: [
      {
        label: 'รายได้ (บาท)',
        data: monthlyRevenue.map(m => m.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
