import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { listColorChart } from '@/libs/appconst';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  dataBeforConvert: any[];
}

const BarChartComponent: FC<Props> = ({ dataBeforConvert }) => {
  const comm = useTranslations('Common');
  const t = useTranslations('webLabel');
  const [dataChart, setDataChart] = useState<any[]>([]);
  const [labels, seLabels] = useState<any[]>([]);

  useEffect(() => {
    setDataChart(convertData(dataBeforConvert));
    seLabels(convetLabels(dataBeforConvert));
  }, [dataBeforConvert]);

  const convertData = (dataBeforeMap) => {
    const dataConver = dataBeforeMap.reduce((acc, monthData) => {
      monthData.data.forEach((item) => {
        const existingCategory = acc.find(
          (convertedItem) => convertedItem.listingCategoryName === item.listingCategoryName,
        );

        if (existingCategory) {
          existingCategory.data.push({
            [`month${monthData.month}`]: item.total,
          });
        } else {
          acc.push({
            listingCategoryName: item.listingCategoryName,
            data: [{ [`month${monthData.month}`]: item.total }],
          });
        }
      });

      return acc;
    }, []);

    return dataConver;
  };
  const convetLabels = (dataBeforeMap) => {
    const labelConver = dataBeforeMap.map((item) => ({
      month: `${item.month}`,
    }));
    return labelConver;
  };
  const data = {
    labels: labels.map((item) => `${comm('month')} ${item.month}`),
    datasets: dataChart.map((item, index) => ({
      label: item.listingCategoryName,
      data: item.data.map((obj) => Object.values(obj)[0]),
      backgroundColor: listColorChart[index],
      stack: 'Stack 0',
    })),
  };
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: false,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  return (
    <>
      <label className="text-lg font-semibold text-portal-textTitleChart">
        {t('EcomDashBoardPropertNumberProperty')}
      </label>
      <Bar height={80} className="w-full" options={options} data={data} />
    </>
  );
};

export default BarChartComponent;
