export default function Loading({ size = 'md', fullScreen = false }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const spinner = (
        <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-cyan-500`}></div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="text-center">
                    {spinner}
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return spinner;
}
