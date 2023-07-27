'use client';
import { useEffect } from 'react';

export default function FixedAlert({ visibleAlert, handleVisibleAlert, text, type = 'success', bgType = 'blur' }) {
    const alertType = {
        success: 'bg-alert-1',
        warn: 'bg-alert-2',
        failed: 'bg-alert-3',
    };

    const alertBackground = {
        blur: 'bg-black bg-opacity-60',
        none: 'bg-none',
    };

    // useEffect(() => {
    //     // if (visibleAlert) {
    //     //     handleVisibleAlert();
    //     // }
    // }, [visibleAlert, handleVisibleAlert]);

    return (
        <>
            {visibleAlert && (
                <div
                    className={`${alertType[type]} fixed left-[50%] top-[110px] z-20 mx-auto w-[320px]  translate-x-[-50%] rounded-rad-3 py-3 text-center font-poppins text-white lg:w-full lg:max-w-screen-lg`}>
                    <h1 className='text-body-4 font-medium lg:text-title-3'>{text}</h1>
                </div>
            )}
        </>
    );
}

//  <div
//      className={`${className} ${alertType[type]}  absolute bottom-12 left-[50%] w-max translate-x-[-50%] rounded-rad-3 px-6 py-4 text-center font-poppins text-body-6 font-medium text-white`}>
//      {text}
//  </div>;
