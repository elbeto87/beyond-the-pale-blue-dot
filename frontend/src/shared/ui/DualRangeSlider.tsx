import { useId } from 'react';

const SLIDER_STEPS = 500;

interface DualRangeSliderProps {
  /** Lower bound of the selectable domain (display units). */
  min: number;
  /** Upper bound of the selectable domain (display units). */
  max: number;
  /** Step in display units. Ignored when scale is 'log'. */
  step?: number;
  /** Current selected minimum (display units). */
  valueMin: number;
  /** Current selected maximum (display units). */
  valueMax: number;
  onChange: (min: number, max: number) => void;
  /** Formats a value for the labels shown next to the slider. */
  formatValue?: (value: number) => string;
  /** 'log' maps the slider position exponentially (min must be > 0). */
  scale?: 'linear' | 'log';
  ariaLabel: string;
}

/**
 * Dual-thumb range slider: two overlapping native range inputs so the user
 * can pick a min/max interval without typing anything.
 */
export function DualRangeSlider({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChange,
  formatValue = (v) => String(v),
  scale = 'linear',
  ariaLabel,
}: DualRangeSliderProps) {
  const id = useId();
  const isLog = scale === 'log';

  // In log mode the native inputs work on 0..SLIDER_STEPS positions that are
  // mapped exponentially onto [min, max]. In linear mode they use raw values.
  const toPos = (value: number): number =>
    isLog ? Math.round((Math.log(value / min) / Math.log(max / min)) * SLIDER_STEPS) : value;
  const toValue = (pos: number): number => {
    if (!isLog) return pos;
    const raw = min * Math.pow(max / min, pos / SLIDER_STEPS);
    // Round to 2 significant digits so labels stay readable.
    if (raw === 0) return 0;
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(raw))) - 1);
    return Math.round(raw / magnitude) * magnitude;
  };

  const posMin = isLog ? 0 : min;
  const posMax = isLog ? SLIDER_STEPS : max;
  const posStep = isLog ? 1 : step;
  const posLo = toPos(valueMin);
  const posHi = toPos(valueMax);

  const percent = (pos: number) => ((pos - posMin) / (posMax - posMin)) * 100;

  function handleLow(pos: number) {
    const clamped = Math.min(pos, posHi);
    onChange(clamped === posMin ? min : toValue(clamped), valueMax);
  }

  function handleHigh(pos: number) {
    const clamped = Math.max(pos, posLo);
    onChange(valueMin, clamped === posMax ? max : toValue(clamped));
  }

  return (
    <div className="dual-range">
      <div className="dual-range__labels">
        <span className="dual-range__value">{formatValue(valueMin)}</span>
        <span className="dual-range__value">{formatValue(valueMax)}</span>
      </div>
      <div className="dual-range__track-area">
        <div className="dual-range__track" />
        <div
          className="dual-range__fill"
          style={{ left: `${percent(posLo)}%`, width: `${percent(posHi) - percent(posLo)}%` }}
        />
        <input
          id={`${id}-min`}
          type="range"
          className="dual-range__input"
          min={posMin}
          max={posMax}
          step={posStep}
          value={posLo}
          onChange={(e) => handleLow(Number(e.target.value))}
          aria-label={`${ariaLabel} minimum`}
        />
        <input
          id={`${id}-max`}
          type="range"
          className="dual-range__input"
          min={posMin}
          max={posMax}
          step={posStep}
          value={posHi}
          onChange={(e) => handleHigh(Number(e.target.value))}
          aria-label={`${ariaLabel} maximum`}
        />
      </div>
    </div>
  );
}

