/////////////////////////////////////////// 
//  円グラフデータ 
///////////////////////////////////////////  

//共通インポート
import React from 'react';
import styles from './charts_Dounut2.module.css';

import { Entry } from '../type';



//関数をインポート
import { getDonutChartData, donutChartOptions } from './charts';

// Chart.js関連のインポート
import { Line, Doughnut } from 'react-chartjs-2';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   ArcElement
 } from 'chart.js';

// Chart.jsコンポーネントの登録
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
  );

interface ChartsUIProps {
  entries: Entry[];  // Entry型の配列
  latestEntry: Entry; // 最新のエントリ
}

const Charts_Dounut2: React.FC<ChartsUIProps> = ({
  latestEntry,
}) => {

  // ドーナツチャートのデータ
  const donutChartData = getDonutChartData(latestEntry);

  // バーデータの設定（latestEntryから実際の値を使用）

  const barData = [
    { 
      label: 'Mineral', 
      value: latestEntry.minerals || 0, 
      color: '#FFB366', 
      maxValue: 5 
    },
    { 
      label: 'BodyFat', 
      value: latestEntry.bodyFat || 0, 
      color: '#FF9E9E', 
      maxValue: 23 
    },
    { 
      label: 'Protein', 
      value: latestEntry.protein || 0, 
      color: '#A8D5A8', 
      maxValue: 15 
    },
    { 
      label: 'BodyWater', 
      value: latestEntry.bodyWater || 0, 
      color: '#7BB3E8', 
      maxValue: 40 
    },
  ];

  // UIコンポーネント
  return (
      <div>
      {/* 体組成分析 */}
        
        {/* 円グラフとバーチャートの横並びレイアウト */}
        <div className={`${styles.graphCard} ${styles.donutChart}`}>
          
          {/* 左側の円グラフ */}
          <div className={styles.chartWrapper}>
             <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>

          {/* 右側のバーチャート */}
          <div className={styles.barList}>
            {barData.map((item, index) => {
              const progress = Math.min(
                Math.max(Number(item.value) / Number(item.maxValue), 0),
                1
              ) * 100;

              return (
              <div key={index} className={styles.barRow}>
                {/* バー */}
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${Number.isFinite(progress) ? progress : 0}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* 数値表示 */}
                <div className={styles.barValue}>
                  {item.value}kg
                </div>

                {/* ラベル表示 */}
                <div className={styles.barLabel}>
                  {item.label}
                </div>
              </div>
            )})}
          </div>
        </div>
          
      </div>
   );
};

export default Charts_Dounut2;
