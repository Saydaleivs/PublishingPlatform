'use client'

import { errorAlert } from '@/app/_components/Alerts'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

export default function ForgetPassword({ searchParams }: any) {
  const router = useRouter()

  const [isValidToken, setIsValidToken] = useState<boolean>()
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: '',
  })

  const checkTokenValidity = async () => {
    const res = await axios
      .get('/api/users/forgetPassword', {
        params: { token: searchParams.token },
      })
      .then(() => setIsValidToken(true))
      .catch(() => setIsValidToken(false))
    console.log(res)
  }

  const resetPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (newPassword.password !== newPassword.confirmPassword) {
      return errorAlert('Confirm your password correctly')
    }

    await axios
      .put('/api/users/forgetPassword', '', {
        params: {
          newPassword: newPassword.password,
          token: searchParams.token,
        },
      })
      .then(() => router.push('/signin'))
  }

  useEffect(() => {
    checkTokenValidity()
  }, [])

  if (isValidToken)
    return (
      <section className='bg-gray-50 dark:bg-gray-900'>
        <ToastContainer />
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <div className='w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8'>
            <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              Change Password
            </h2>
            <form
              onSubmit={resetPassword}
              className='mt-4 space-y-4 lg:mt-5 md:space-y-5'
              action='#'
            >
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  New Password
                </label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  value={newPassword.password}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, password: e.target.value })
                  }
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='confirm-password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Confirm password
                </label>
                <input
                  type='confirm-password'
                  name='confirm-password'
                  id='confirm-password'
                  value={newPassword.confirmPassword}
                  onChange={(e) =>
                    setNewPassword({
                      ...newPassword,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
              </div>
              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    id='newsletter'
                    aria-describedby='newsletter'
                    type='checkbox'
                    className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                    required
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label
                    htmlFor='newsletter'
                    className='font-light text-gray-500 dark:text-gray-300'
                  >
                    I accept the{' '}
                    <a
                      className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                      href='#'
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type='submit'
                className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Reset passwod
              </button>
            </form>
          </div>
        </div>
      </section>
    )
}