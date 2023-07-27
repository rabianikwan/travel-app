'use client';

export default function Label({ className = 'mb-1 text-body-3 font-normal', htmlFor, children, ...rest }) {
    return (
        <label {...rest} htmlFor={htmlFor} className={`${className} font-poppins`}>
            {children}
        </label>
    );
}
