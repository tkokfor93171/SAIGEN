import React from 'react';

interface SliderProps {
  defaultValue: number[];
  min: number;
  max: number;
  step: number;
  className?: string;
  thumbClassName?: string;
  trackClassName?: string;
  width?: string;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  defaultValue,
  min,
  max,
  step,
  className,
  trackClassName,
  width = '100%',
  onChange,
}) => {
  return (
    <input
      type="range"
      defaultValue={defaultValue[0]}
      min={min}
      max={max}
      step={step}
      className={`${className}`}
      style={{
        width: width,
        background: `linear-gradient(to right, ${trackClassName} 0%, ${trackClassName} ${defaultValue[0]}%, ${className} ${defaultValue[0]}%, ${className} 100%)` }}
      onChange={(e) => onChange && onChange(Number(e.target.value))}
    />
  );
};

export default Slider;