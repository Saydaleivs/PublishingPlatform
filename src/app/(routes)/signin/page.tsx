'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/app/_components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import Link from 'next/link'
import { errorAlert, successAlert } from '@/app/_components/Alerts'

export default function Signin() {
  const router = useRouter()

  const [user, setUser] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const signin = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    await axios
      .post('/api/users/signin', user)
      .then((response) => {
        if (response.status === 200) {
          router.push('/dashboard')
        }
      })
      .catch((err) => {
        errorAlert(err.response.data.error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const forgetPassword = async () => {
    if (loading) return
    if (!user.email.length) {
      return errorAlert(
        'Please enter your email to use forget password feature'
      )
    }

    if (!isValidEmail(user.email)) {
      return errorAlert('It is not a valid email')
    }

    setLoading(true)
    await axios
      .get('/api/users/forgetPassword', {
        params: { email: user.email },
      })
      .then(() => router.push('/checkInbox?type=password&email=' + user.email))
      .catch((err) => errorAlert(err.response.data.message))
      .finally(() => setLoading(false))
  }

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <ToastContainer />
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          {/* Company logo */}
          <img
            className='mx-auto h-10 w-auto'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            alt='Your Company'
          />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            onSubmit={signin}
            className='space-y-6'
            action='#'
            method='POST'
          >
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  style={{
                    border: '2px solid #858585',
                  }}
                  autoComplete='email'
                  value={user?.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password
                </label>
                <div className='text-sm'>
                  <Link
                    onClick={forgetPassword}
                    href={'/signin'}
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  style={{
                    border: '2px solid #858585',
                  }}
                  value={user?.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  autoComplete='current-password'
                  required
                  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                {loading ? <Loader /> : 'Sign in'}
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            Not a member?{' '}
            <Link
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
              href='/signup'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
