import { Loader2 } from 'lucide-react';

const LoadingCircles = ({ size = 50, color = '#000' }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <Loader2
                size={size}
                color={color}
                style={{ animation: 'spin 1s linear infinite' }}
            />
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default LoadingCircles;