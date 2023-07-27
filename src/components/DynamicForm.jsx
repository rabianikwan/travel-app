'use client';

import { BsFillCheckCircleFill } from 'react-icons/bs';
import Input from './Input';
import Label from './Label';

//Utils
import { formatToLocale } from '@/utils/formatToLocale';

export default function DynamicForm({ isMobile, elements, handleChange, handleOpenCalendar, formStatus, formInputError }) {
    return (
        <>
            {elements &&
                elements.map((form, index) => {
                    return (
                        <div
                            key={index}
                            className='mx-4 rounded-t-rad-2 border border-pur-3 lg:mx-0 lg:rounded-none lg:border-none'>
                            <div className='flex items-center justify-between rounded-t-rad-2 bg-pur-5 px-4 py-2 text-white lg:bg-net-4'>
                                <h2 className='text-title-2'>
                                    P{index + 1} {' - '} Passengers Details {index + 1} {' - '}
                                    {form.type}
                                </h2>
                                {formStatus && (
                                    <BsFillCheckCircleFill className='h-[20px] w-[20px]  text-alert-1 lg:h-[24px] lg:w-[24px]' />
                                )}
                            </div>
                            {form &&
                                form.fields.map((formElement, index) => {
                                    return (
                                        <div key={index} className='mt-4 p-4 lg:p-0'>
                                            {formElement.field_type === 'text' && (
                                                <div className='flex flex-col gap-1'>
                                                    <Label
                                                        className='text-body-6 font-bold text-pur-5'
                                                        htmlFor={formElement.field_id}>
                                                        {formElement.field_label}
                                                    </Label>
                                                    <Input
                                                        className={`${
                                                            formInputError ? 'border border-red-500' : 'border'
                                                        } w-full appearance-none  px-4 py-2 font-poppins outline-none`}
                                                        id={formElement.field_id}
                                                        onChange={(event) =>
                                                            handleChange(formElement.field_id, event, form.form_id)
                                                        }
                                                    />
                                                </div>
                                            )}
                                            {formElement.field_type === 'date' && (
                                                <div className='flex flex-col gap-1'>
                                                    <Label
                                                        className='text-body-6 font-bold text-pur-5'
                                                        htmlFor={formElement.field_id}>
                                                        {formElement.field_label}
                                                    </Label>
                                                    <Input
                                                        className={`${
                                                            formInputError ? 'border border-red-500' : 'border'
                                                        } w-full appearance-none  px-4 py-2 font-poppins outline-none`}
                                                        readOnly
                                                        id={formElement.field_id}
                                                        value={formElement.field_value && formatToLocale(formElement.field_value)}
                                                        onClick={() => {
                                                            // handleIsDekstop();
                                                            handleOpenCalendar(formElement.field_id, form.form_id, isMobile);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {formElement.field_type === 'select' && (
                                                <div className='flex flex-col gap-1 '>
                                                    <Label className='text-body-6 font-bold text-pur-5'>
                                                        {formElement.field_label}
                                                    </Label>
                                                    <select
                                                        onChange={(event) =>
                                                            handleChange(formElement.field_id, event, form.form_id)
                                                        }
                                                        className={`${
                                                            formInputError ? 'border-red-500' : 'border'
                                                        } w-full cursor-pointer appearance-none border px-4 py-2 font-poppins outline-none`}
                                                        aria-label='Default select example'>
                                                        {formElement.field_options.length > 0 &&
                                                            formElement.field_options.map((option, i) => (
                                                                <option value={option.option_label} key={i}>
                                                                    {option.option_label}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                })}
        </>
    );
}
