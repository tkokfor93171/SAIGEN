import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import AnimationControls from '@/components/AnimationControls';
import BoardTable from '@/components/BoardTable';
import { fetchData } from '@/utils/api';
import { Data } from '@/types';

const Home: React.FC = () => {
  const [symbol, setSymbol] = useState('4582');
  const [date, setDate] = useState('2024-07-26');
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [lastEvaluatedKeys, setLastEvaluatedKeys] = useState<{ priceVolume: string | null; boardData: string | null } | null>(null);

  const currentData = useMemo(() => data?.boardData[currentDataIndex], [data, currentDataIndex]);

  const loadData = async (isInitialLoad: boolean = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const result = await fetchData(symbol, formattedDate, isInitialLoad ? undefined : lastEvaluatedKeys || undefined);
      
      console.log('Loaded data:', result);

      if (isInitialLoad) {
        if (result.boardData.length === 0 && result.priceVolumeData.length === 0) {
          setError('指定された日付のデータが見つかりません。');
        } else {
          setData(result);
          setCurrentDataIndex(0);
        }
      } else {
        setData(prevData => {
          if (!prevData) {
            console.warn('prevData is null during non-initial load');
            return result;
          }
          return {
            priceVolumeData: [...prevData.priceVolumeData, ...result.priceVolumeData],
            boardData: [...prevData.boardData, ...result.boardData],
            lastEvaluatedKeys: result.lastEvaluatedKeys
          };
        });
      }
      
      setLastEvaluatedKeys(result.lastEvaluatedKeys || null);
    } catch (error) {
      console.error('Detailed error in loadData:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      setError('データの読み込み中にエラーが発生しました: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [symbol, date]);

  const handleDataChange = useCallback((index: number) => {
    setCurrentDataIndex(index);
    if (index > (data?.boardData.length || 0) - 20 && lastEvaluatedKeys) {
      loadData(false);
    }
  }, [data, lastEvaluatedKeys, loadData]);

  return (
    <div className="flex flex-col w-full h-screen p-4">
      {data && (
        <AnimationControls
          data={data}
          onDataChange={handleDataChange}
        />
      )}

      {data && data.boardData.length > 0 && (
        <div className="text-center my-2">
          現在の時刻: {new Date(data.boardData[currentDataIndex].timestamp).toLocaleString()}
        </div>
      )}

      <div className="flex-1 overflow-x-auto mt-4">
        <div className="w-full max-w-xl">
          {isLoading && <p>データを読み込み中...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && currentData && <BoardTable data={currentData} />}
        </div>
      </div>

      <div className="mb-4 flex space-x-4 mt-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">銘柄コード</label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">日付</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => loadData(true)} className="mb-1">データ取得</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;