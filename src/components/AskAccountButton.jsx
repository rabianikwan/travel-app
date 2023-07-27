'use client';

export default function AskAccountButton({ prefix, suffix, onClick }) {
    return (
        <div className='flex justify-center'>
            <p className='font-poppins text-body-6 font-normal'>
                {prefix}

                <span onClick={onClick} className='ml-2 cursor-pointer font-bold text-pur-3 hover:text-pur-2'>
                    {suffix}
                </span>
            </p>
        </div>
    );
}
