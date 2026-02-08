import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

let isRegistered = false;

// Register Chart.js components
export function registerChartJS() {
  if (isRegistered) {
    return;
  }
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );
  
  isRegistered = true;
}

// Auto-register on module load (client-side only)
if (typeof window !== 'undefined') {
  registerChartJS();
}
