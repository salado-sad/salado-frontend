/**
 * Reports web vitals for performance measurement.
 * @param {function} onPerfEntry - Function to handle performance entries.
 */
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry); // New replacement
  }
};

export default reportWebVitals;