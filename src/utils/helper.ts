import { BoardData } from '@/types';

export const getMaxQuantity = (data: BoardData) => {
  const quantities = [
    data.Sell1_Qty, data.Sell2_Qty, data.Sell3_Qty, data.Sell4_Qty, data.Sell5_Qty,
    data.Sell6_Qty, data.Sell7_Qty, data.Sell8_Qty, data.Sell9_Qty, data.Sell10_Qty,
    data.Buy1_Qty, data.Buy2_Qty, data.Buy3_Qty, data.Buy4_Qty, data.Buy5_Qty,
    data.Buy6_Qty, data.Buy7_Qty, data.Buy8_Qty, data.Buy9_Qty, data.Buy10_Qty
  ].filter(q => typeof q === 'number' && q > 0);
  const max = Math.max(...quantities);
  console.log('Max quantity:', max);
  return max;
};

export const calculateWidth = (quantity: number, max: number) => {
  if (max === 0) return 0;
  const width = (quantity / max) * 100;
  console.log(`Calculated width for quantity ${quantity}: ${width}%`);
  return width;
};