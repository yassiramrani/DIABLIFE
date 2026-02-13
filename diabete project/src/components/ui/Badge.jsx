import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
    const variants = {
        default: "border-transparent bg-primary-500 text-white hover:bg-primary-600",
        secondary: "border-transparent bg-secondary-500 text-white hover:bg-secondary-600",
        outline: "text-slate-950 border-slate-200",
        danger: "border-transparent bg-red-500 text-white",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-white",
    };

    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props}>
            {children}
        </div>
    );
}
