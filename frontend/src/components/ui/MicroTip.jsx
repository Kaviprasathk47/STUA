import { Info } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * MicroTip Component
 * 
 * A subtle, contextual hint that appears near user actions to guide decisions
 * without interrupting the flow. Follows strict UX principles:
 * - Non-blocking and optional
 * - One sentence only
 * - Visually subtle
 * - Accessible on all devices
 */
const MicroTip = ({
    text,
    variant = 'default',
    className = '',
    showIcon = true
}) => {
    // Variant styles
    const variants = {
        default: 'text-slate-500 bg-slate-50 border-slate-200',
        success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        info: 'text-blue-600 bg-blue-50 border-blue-200',
        warning: 'text-amber-600 bg-amber-50 border-amber-200',
    };

    const variantClass = variants[variant] || variants.default;

    return (
        <div
            className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg border ${variantClass} ${className}`}
            role="note"
            aria-label="Helpful tip"
        >
            {showIcon && (
                <Info
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                />
            )}
            <span className="leading-relaxed">{text}</span>
        </div>
    );
};

MicroTip.propTypes = {
    text: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['default', 'success', 'info', 'warning']),
    className: PropTypes.string,
    showIcon: PropTypes.bool,
};

export default MicroTip;
