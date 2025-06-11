
import '../styles/loading-spinner.css';

export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading data...</p>
    </div>
  );
}