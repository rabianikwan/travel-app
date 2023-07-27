'use client';

//core
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// third Parties
import { useSession, signOut } from 'next-auth/react';
import { FiArrowLeft, FiEdit3, FiSettings, FiLogOut } from 'react-icons/fi';
import axios from 'axios';

//redux
//----

//components
import Navbar from '@/components/Navbar';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import BottomNavbar from '@/components/BottomNavbar';
import AlertBottom from '@/components/AlertBottom';
import AlertTop from '@/components/AlertTop';

//utils
//----

export default function Akun() {
    /*=== core ===*/
    const router = useRouter();

    /*=== next auth ===*/
    const { data: session, status } = useSession();
    let token = session?.user?.token;

    /*=== redux ===*/
    //----

    /*=== state ===*/
    const [isMobileUpdateProfil, setIsMobileUpdateProfil] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorInput, setErrorInput] = useState(false);
    const [changeData, setChangeData] = useState(false);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('');
    const [fetchData, setFetchData] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(1);
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    //button opt
    const option = [
        {
            id: 1,
            menu: 'Account Settings',
            icons: <FiSettings className='h-[18px] w-[18px]  group-hover:text-white' />,
        },
        {
            id: 3,
            menu: 'Sign Out',
            icons: <FiLogOut className='h-[18px] w-[18px]   group-hover:text-white' />,
        },
    ];

    /*=== function === */

    const handleMobileUpdateProfil = () => {
        setIsMobileUpdateProfil(!isMobileUpdateProfil);
    };

    const handleOnChangeProfil = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const updateProfile = async () => {
        try {
            const URL_UPDATE = 'https://kel1airplaneapi-production.up.railway.app/api/v1/user/update';

            if (!userData.name || !userData.phone) {
                setErrorInput(true);
                handleVisibleAlert('Please fill all data!', 'failed');
                return;
            }

            const res = await axios.put(
                URL_UPDATE,
                {
                    nama: userData.name,
                    phone: userData.phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.status == 200 || res.data.status == 'OK') {
                handleVisibleAlert('Succesfully update the profile!', 'success');
                setIsLoading(true);
                setFetchData(true);
                setChangeData(false);
            }
        } catch (error) {
            // console.log('ERR PROFILE', error);
        }
    };

    const handleSelectedMenu = (id) => setSelectedMenu(id);
    const handleVisibleAlert = (text, alertType) => {
        setAlertText(text);
        setAlertType(alertType);
        setVisibleAlert(!visibleAlert);
    };

    /*=== effects ===*/
    useEffect(() => {
        if (token) {
            if (fetchData) {
                async function fetchUserData() {
                    try {
                        const URL = 'https://kel1airplaneapi-production.up.railway.app/api/v1/user/getProfile';
                        const res = await axios.get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        setUserData({
                            name: res.data.data.nama,
                            email: res.data.data.email,
                            phone: res.data.data.phone,
                        });

                        // console.log('CURRENT USER:', res.data);
                    } catch (error) {
                        handleVisibleAlert('Session Expired!', 'failed');
                        setTimeout(() => {
                            signOut();
                        }, 2500);
                    } finally {
                        setIsLoading(false);
                    }
                }
                fetchUserData();
            }
            setFetchData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, session, token]);

    return (
        <div className='overflow-x-hidden'>
            {/* DEKSTOP MODE */}

            {/* navbar */}
            <Navbar className={'hidden lg:block'} />
            {/* navbar */}

            {/* header */}
            <div className='mt-[80px] hidden w-screen border border-b-net-2 pb-4 lg:block'>
                <div className='container mx-auto hidden max-w-screen-lg grid-cols-12 gap-3 font-poppins lg:grid'>
                    <h1 className='col-span-12 mb-[24px] mt-[47px] font-poppins text-head-1 font-bold'>Account</h1>
                    <div
                        className='col-span-12 flex cursor-pointer items-center gap-4 rounded-rad-3 bg-pur-3 py-[13px] font-poppins text-title-2 font-medium text-white'
                        onClick={() => router.push('/')}>
                        <FiArrowLeft className='ml-[21px]  h-6 w-6 ' />
                        <p>Home</p>
                    </div>
                </div>
            </div>
            {/* header */}

            {/* content */}
            <div className='container mx-auto  mt-[27px] hidden h-screen max-w-screen-lg grid-cols-12 gap-3 font-poppins lg:grid'>
                <div className='col-span-12 grid grid-cols-12 gap-[56px]'>
                    <div className='col-span-4'>
                        {option &&
                            option.map((opt) => (
                                <div
                                    key={opt.id} //opt.action;
                                    //handleSelectedMenu(opt.id);
                                    onClick={() => (opt.id === 3 ? signOut() : handleSelectedMenu(opt.id))}
                                    className={`${
                                        selectedMenu === opt.id ? 'group bg-pur-2 text-white' : 'group bg-white text-black'
                                    }  flex cursor-pointer items-center gap-4 rounded-rad-2 border-b-[1px] px-3 py-4 hover:bg-pur-2 `}>
                                    {opt.icons}
                                    <p
                                        className={`${
                                            selectedMenu === opt.id ? ' text-white' : ' text-black'
                                        } font-poppins text-title-2 font-medium  group-hover:text-white`}>
                                        <span
                                            className={`${
                                                selectedMenu === opt.id ? ' text-white' : ' text-black'
                                            }  group-hover:text-white`}>
                                            {opt.menu}
                                        </span>
                                    </p>
                                </div>
                            ))}
                    </div>
                    <div className='col-span-8 h-max rounded-rad-2 px-6 shadow-low'>
                        {selectedMenu === 1 && (
                            <div>
                                <div className='mb-5 mt-[40px] flex gap-2'>
                                    <h1 className='text-head-1 font-bold'>Update Profile</h1>
                                    <p className='text-start text-body-3 font-normal text-alert-3'>
                                        *You {"can't"} update emails!
                                    </p>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div className='rounded-t-rad-2 bg-pur-3 px-4 py-2 text-title-2 text-white'>
                                        <h1>Profile Data</h1>
                                    </div>

                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col gap-2'>
                                            <Label htmlFor={'name'} className='text-body-6 font-bold text-pur-5'>
                                                Full Name
                                            </Label>
                                            <Input
                                                id={'name'}
                                                onChange={handleOnChangeProfil}
                                                name={'name'}
                                                // readOnly
                                                disabled={!changeData}
                                                value={isLoading ? 'loading data...' : userData.name}
                                                className={`${
                                                    errorInput && !userData.name ? 'border-alert-3' : 'border'
                                                } rounded-rad-1   px-4 py-2`}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label htmlFor={'phone'} className='text-body-6 font-bold text-pur-5'>
                                                Phone Number
                                            </Label>
                                            <Input
                                                id={'phone'}
                                                onChange={handleOnChangeProfil}
                                                name={'phone'}
                                                // readOnly
                                                disabled={!changeData}
                                                value={isLoading ? 'loading data...' : userData.phone}
                                                className={`${
                                                    errorInput && !userData.phone ? 'border-alert-3' : 'border'
                                                } rounded-rad-1 px-4 py-2`}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label htmlFor={'email'} className='text-body-6 font-bold text-pur-5'>
                                                Emails
                                            </Label>
                                            <Input
                                                id={'email'}
                                                readOnly
                                                disabled
                                                value={isLoading ? 'loading data...' : userData.email}
                                                className='cursor-not-allowed rounded-rad-1 px-4 py-2'
                                            />
                                        </div>
                                        <div className='mb-6 mt-5 flex justify-center'>
                                            <div className='flex gap-2'>
                                                {!changeData ? (
                                                    <Button
                                                        onClick={() => setChangeData(true)}
                                                        className='rounded-rad-3 bg-pur-3 px-11 py-3 text-white'>
                                                        Update data
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => updateProfile()}
                                                        className='rounded-rad-3 bg-pur-2 px-11 py-3 text-white'>
                                                        Save
                                                    </Button>
                                                )}

                                                {changeData && (
                                                    <Button
                                                        onClick={() => {
                                                            setErrorInput(false);
                                                            setChangeData(false);
                                                            setIsLoading(true);
                                                            setFetchData(true);
                                                        }}
                                                        className='rounded-rad-3 bg-alert-3 px-11 py-3 text-white'>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* <AlertBottom
                            visibleAlert={visibleAlert}
                            handleVisibleAlert={handleVisibleAlert}
                            text={alertText}
                            type={alertType}
                        /> */}
                    </div>
                </div>
            </div>
            {/* content */}

            {/* DEKSTOP MODE */}

            {/* RESPONSIVE MODE */}
            <div className='mx-[24px] mt-[64px]  font-poppins lg:hidden'>
                <h1 className='text-head-2 font-bold'>Account</h1>

                <div className='mt-[36px]'>
                    {option &&
                        option.map((opt) => (
                            <div
                                key={opt.id} //opt.action;
                                //handleSelectedMenu(opt.id);
                                onClick={() => (opt.id === 3 ? signOut() : handleMobileUpdateProfil())}
                                className={`  group flex cursor-pointer items-center gap-4 rounded-rad-2 border-b-[1px] px-3 py-4 hover:bg-pur-3  `}>
                                {opt.icons}
                                <p className={` font-poppins text-title-2 font-medium  text-black group-hover:text-white`}>
                                    <span className={`  text-black group-hover:text-white`}>{opt.menu}</span>
                                </p>
                            </div>
                        ))}
                </div>

                <div className='mt-4 flex justify-center'>
                    <h1 className='text-body-3 text-net-3'>Version 1.1.0</h1>
                </div>

                <BottomNavbar />
            </div>

            {isMobileUpdateProfil && (
                <div className='fixed inset-0 top-0 z-20 h-screen overflow-y-scroll bg-white font-poppins lg:hidden'>
                    <div className='px-4'>
                        <div
                            onClick={() => handleMobileUpdateProfil()}
                            className='fixed inset-x-0 top-0 z-10 flex items-center gap-6 bg-pur-3 px-[16px]  py-2  text-white'>
                            <FiArrowLeft className='h-[28px] w-[28px]' /> <p>Update Profile</p>
                        </div>

                        <div className='mt-[100px] flex flex-col gap-3'>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor={'name'} className='text-body-6 font-bold text-pur-5'>
                                    Full Name
                                </Label>
                                <Input
                                    id={'name'}
                                    onChange={handleOnChangeProfil}
                                    name={'name'}
                                    // readOnly
                                    disabled={!changeData}
                                    value={isLoading ? 'loading data...' : userData.name}
                                    className={`${
                                        errorInput && !userData.name ? 'border-alert-3' : 'border'
                                    } rounded-rad-1   px-4 py-2`}
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor={'phone'} className='text-body-6 font-bold text-pur-5'>
                                    Phone Number
                                </Label>
                                <Input
                                    id={'phone'}
                                    onChange={handleOnChangeProfil}
                                    name={'phone'}
                                    // readOnly
                                    disabled={!changeData}
                                    value={isLoading ? 'loading data...' : userData.phone}
                                    className={`${
                                        errorInput && !userData.phone ? 'border-alert-3' : 'border'
                                    } rounded-rad-1 px-4 py-2`}
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor={'email'} className='text-body-6 font-bold text-pur-5'>
                                    Emails
                                </Label>
                                <Input
                                    id={'email'}
                                    readOnly
                                    disabled
                                    value={isLoading ? 'loading data...' : userData.email}
                                    className='cursor-not-allowed rounded-rad-1 px-4 py-2'
                                />
                            </div>
                            <div className='mb-6 mt-5 flex justify-center'>
                                <div className='flex gap-2'>
                                    {!changeData ? (
                                        <Button
                                            onClick={() => setChangeData(true)}
                                            className='rounded-rad-3 bg-pur-3 px-11 py-3 text-white'>
                                            Update data
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => updateProfile()}
                                            className='rounded-rad-3 bg-pur-2 px-11 py-3 text-white'>
                                            Save
                                        </Button>
                                    )}

                                    {changeData && (
                                        <Button
                                            onClick={() => {
                                                setErrorInput(false);
                                                setChangeData(false);
                                                setIsLoading(true);
                                                setFetchData(true);
                                            }}
                                            className='rounded-rad-3 bg-alert-3 px-11 py-3 text-white'>
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* RESPONSIVE MODE */}

            <AlertTop
                visibleAlert={visibleAlert}
                handleVisibleAlert={handleVisibleAlert}
                text={alertText}
                type={alertType}
                bgType='none'
            />
        </div>
    );
}
