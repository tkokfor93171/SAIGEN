import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Slider from './Slider';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';
import { Data } from '../types';

interface AnimationControlsProps {
  data: Data;
  onDataChange: (index: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({ data, onDataChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<number | null>(null);

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const moveFrames = (frames: number) => {
    const newIndex = Math.max(0, Math.min(currentIndex + frames, data.boardData.length - 1));
    setCurrentIndex(newIndex);
    onDataChange(newIndex);
  };

  const handleSliderChange = (value: number) => {
    const newIndex = Math.floor((value / 100) * (data.boardData.length - 1));
    setCurrentIndex(newIndex);
    onDataChange(newIndex);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex >= data.boardData.length) {
            setIsPlaying(false);
            return prevIndex;
          }
          onDataChange(newIndex);
          return newIndex;
        });
      }, 1000 / speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, data.boardData.length, onDataChange]);

  return (
    <div className="flex flex-col w-full">
      <Slider
        defaultValue={[0]}
        min={0}
        max={100}
        step={1}
        className="h-2 bg-muted rounded-full"
        thumbClassName="bg-primary w-4 h-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 cursor-grab active:cursor-grabbing"
        trackClassName="bg-primary h-2 rounded-full"
        width="100%"
        onChange={handleSliderChange}
      />
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => moveFrames(-5)}>-5flm</Button>
          <Button variant="outline" onClick={() => moveFrames(-1)}>-1flm</Button>
          <Button variant="outline" onClick={playPause}>
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </Button>
          <Button variant="outline" onClick={() => moveFrames(1)}>+1flm</Button>
          <Button variant="outline" onClick={() => moveFrames(5)}>+5flm</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select onValueChange={(value) => setSpeed(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder={`${speed}倍速`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1倍速</SelectItem>
              <SelectItem value="2">2倍速</SelectItem>
              <SelectItem value="3">3倍速</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;