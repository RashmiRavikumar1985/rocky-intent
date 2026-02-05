import { Camera, CameraOff, Loader2 } from 'lucide-react';

interface HandTrackingToggleProps {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  onToggle: () => void;
}

const HandTrackingToggle = ({ isActive, isLoading, error, onToggle }: HandTrackingToggleProps) => {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`
        fixed top-6 right-6 z-50
        flex items-center gap-3 px-5 py-3
        glass-card cursor-pointer
        transition-all duration-300
        hover:border-molten/50 hover:shadow-lg hover:shadow-molten/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isActive ? 'border-molten/40' : 'border-border'}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-molten animate-spin" />
      ) : isActive ? (
        <Camera className="w-5 h-5 text-molten" />
      ) : (
        <CameraOff className="w-5 h-5 text-muted-foreground" />
      )}
      
      <span className="text-sm tracking-wide">
        {isLoading 
          ? 'Initializing...' 
          : isActive 
            ? 'Neural Input Active' 
            : 'Enable Neural Input'}
      </span>

      {error && (
        <span className="text-xs text-destructive ml-2">{error}</span>
      )}
    </button>
  );
};

export default HandTrackingToggle;
