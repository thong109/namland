'use client';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  registerables as registerablesJS,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTranslations } from 'next-intl';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  ...registerablesJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

const ChartPerformance = ({ data }) => {
  const t = useTranslations('webLabel');

  const dataReport = {
    labels: [t('views'), t('engagement'), t('saveAndShare'), t('Enquiries')],
    datasets: [
      {
        backgroundColor: ['#E8CE6C', '#E8CE6C', '#E8CE6C', '#E8CE6C'],
        data: [data?.totalViews, data?.dayOnMarket, data?.totalFavories, data?.totalInquiry],
      },
    ],
  };
  return (
    <div>
      <Bar
        style={{ height: 200 }}
        data={dataReport}
        plugins={[ChartDataLabels]}
        height={300}
        options={{
          maintainAspectRatio: false,
          indexAxis: 'y' as const,
          responsive: true,
        }}
      />
    </div>
  );
};

export default ChartPerformance;
