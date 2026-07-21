///////////////////////////////////////////
// 10. グラフデータ
///////////////////////////////////////////

//共通インポート
import { Entry } from '../type'; 

//関数のエクスポート
const toFiniteNumber = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

//折れ線グラフのデータ
export const getLineChartData = (entries: Entry[], metric: 'totalWeight' | 'bodyFat' | 'totalMuscle') => {
  let label;
  let borderColor;
  let backgroundColor;

  switch (metric) {
    case 'bodyFat':
      label = 'BodyFat';
      borderColor = 'rgba(255, 99, 132, 1)';      // Red for body fat
      backgroundColor = 'rgba(255, 99, 132, 0.2)';
      break;
    case 'totalMuscle':
      label = ' Muscle';
      borderColor = 'rgba(54, 162, 235, 1)';      // Blue for muscle mass
      backgroundColor = 'rgba(54, 162, 235, 0.2)';
      break;
    default:
      label = 'Weight';
      borderColor = 'rgba(75, 192, 192, 1)';      // Green for weight
      backgroundColor = 'rgba(75, 192, 192, 0.2)';
  }

  return {
    labels: entries.map(entry => entry.date),
    datasets: [
      {
        label,
        data: entries.map(entry => toFiniteNumber(entry[metric])),
        borderColor,
        backgroundColor,
      },
    ],
  };
};


// ドーナツチャートのデータ
export const getDonutChartData = (latestEntry: Entry) => {
  return {
    labels: ['体水分', 'タンパク質', 'ミネラル', '体脂肪'],  // グラフのラベル
    datasets: [
      {
        data: [
          toFiniteNumber(latestEntry.bodyWater),  // 体水分
          toFiniteNumber(latestEntry.protein),    // タンパク質
          toFiniteNumber(latestEntry.minerals),   // ミネラル
          toFiniteNumber(latestEntry.bodyFat),    // 体脂肪
        ],
        backgroundColor: ['#9fbcde', '#acdbb7', '#FFC374', '#FF9E9E'], // 円グラフの各セクションの色
        borderWidth: 1, // 円グラフのセクションの枠線の太さ
      },
    ],
  };
};


// ドーナツチャートのオプション
export const donutChartOptions = {
  plugins: {
	    tooltip: {
	      callbacks: {
	        label: function (tooltipItem: any) {
	          return `${tooltipItem.label}: ${toFiniteNumber(tooltipItem.raw).toFixed(2)} kg`;
	        },
	      },
	    },
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      formatter: (value: number) => value.toFixed(2),
      color: '#fff',
      font: {
        weight: 'bold',
      },
    },
  },
  cutout: '70%',
};




