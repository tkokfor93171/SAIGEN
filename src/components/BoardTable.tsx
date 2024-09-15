import React from 'react';
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { BoardData } from '../types';
import { getMaxQuantity, calculateWidth } from '@//utils/helper';

interface BoardTableProps {
  data: BoardData;
}

const BoardTable: React.FC<BoardTableProps> = ({ data }) => {
  const maxQuantity = getMaxQuantity(data);

  return (
    <Table className="w-full">
      <TableBody>
        {[...Array(23)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* Left Column */}
            <TableCell className="w-1/3 font-medium py-1 text-sm text-center relative">
              {rowIndex === 0 ? (
                <span className="relative z-10">{data.OverSellQty}</span>
              ) : (rowIndex > 0 && rowIndex <= 10) && (
                <>
                  <div
                    className="absolute top-0 left-0 h-full bg-red-200"
                    style={{
                      width: `${calculateWidth(data[`Sell${11 - rowIndex}_Qty`], maxQuantity)}%`,
                      minWidth: '1px'
                    }}
                  ></div>
                  <span className="relative z-10">{data[`Sell${11 - rowIndex}_Qty`]}</span>
                </>
              )}
            </TableCell>

            {/* Middle Column */}
            <TableCell className="w-1/3 font-medium py-1 text-sm text-center">
              {rowIndex >= 1 && rowIndex <= 10 && data[`Sell${11 - rowIndex}_Price`]}
              {rowIndex >= 12 && rowIndex <= 21 && data[`Buy${rowIndex - 11}_Price`]}
            </TableCell>

            {/* Right Column */}
            <TableCell className="w-1/3 font-medium py-1 text-sm text-center relative">
              {rowIndex >= 12 && rowIndex <= 21 && (
                <>
                  <div
                    className="absolute top-0 right-0 h-full bg-green-200"
                    style={{
                      width: `${calculateWidth(data[`Buy${rowIndex - 11}_Qty`], maxQuantity)}%`,
                      minWidth: '1px'
                    }}
                  ></div>
                  <span className="relative z-10">{data[`Buy${rowIndex - 11}_Qty`]}</span>
                </>
              )}
              {rowIndex === 22 && (
                <span className="relative z-10">{data.UnderBuyQty}</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BoardTable;