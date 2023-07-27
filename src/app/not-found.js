'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/Button';

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <>
            <div className='flex h-screen flex-col items-center justify-center gap-6 font-poppins'>
                <h1 className='text-title-2 font-medium text-pur-3 lg:text-head-3'>Looks like {"you've"} been missing!</h1>
                <Image alt='' src={'/new_images/not_found.png'} width={250} height={250} priority />
                <Button
                    onClick={() => {
                        router.replace('/');
                        router.refresh();
                    }}
                    className='rounded-rad-2 border-2 border-pur-3 bg-white px-5 py-2 font-medium text-pur-3 hover:border-pur-2 hover:bg-pur-2 hover:text-white'>
                    Back to Home
                </Button>
            </div>
        </>
    );
}
