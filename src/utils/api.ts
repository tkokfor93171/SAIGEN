import { Data, ApiResponse, PriceVolumeData, BoardData } from '@/types';

export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 120000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('リクエストがタイムアウトしました。');
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('ネットワーク接続エラーが発生しました。インターネット接続を確認してください。');
      }
    }
    throw error;
  }
};

export const fetchData = async (symbol: string, date: string, lastEvaluatedKeys?: { priceVolume: string | null; boardData: string | null }): Promise<Data> => {
  try {
    const priceVolumeUrl = `http://localhost:8000/api/price_volume_data/${symbol}?date=${date}${lastEvaluatedKeys?.priceVolume ? `&last_evaluated_key=${lastEvaluatedKeys.priceVolume}` : ''}`;
    const boardDataUrl = `http://localhost:8000/api/board_data/${symbol}?date=${date}${lastEvaluatedKeys?.boardData ? `&last_evaluated_key=${lastEvaluatedKeys.boardData}` : ''}`;

    console.log('Fetching from:', priceVolumeUrl, boardDataUrl);

    const [priceVolumeResponse, boardDataResponse] = await Promise.all([
      fetchWithTimeout(priceVolumeUrl),
      fetchWithTimeout(boardDataUrl)
    ]);

    const priceVolumeResult: ApiResponse = await priceVolumeResponse.json();
    const boardDataResult: ApiResponse = await boardDataResponse.json();

    console.log('Price volume result:', priceVolumeResult);
    console.log('Board data result:', boardDataResult);

    if (!Array.isArray(priceVolumeResult.data) || !Array.isArray(boardDataResult.data)) {
      throw new Error('Unexpected API response structure');
    }

    return {
      priceVolumeData: priceVolumeResult.data as PriceVolumeData[],
      boardData: boardDataResult.data as BoardData[],
      lastEvaluatedKeys: {
        priceVolume: priceVolumeResult.last_evaluated_key,
        boardData: boardDataResult.last_evaluated_key
      }
    };
  } catch (error) {
    console.error('Detailed error in fetchData:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};