import Image from 'next/image';

export default function LoadingAkun() {
    return (
        <div className='flex h-screen flex-col items-center justify-center gap-3 font-poppins'>
            <h1 className='text-title-2 font-bold text-net-3'>Please wait...</h1>
            <Image alt='' src={'/new_images/loading.svg'} width={200} height={200} priority />
        </div>
    );
}
