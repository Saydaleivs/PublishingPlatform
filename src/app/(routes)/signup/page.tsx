'use client'

import axios from 'axios'
import Link from 'next/link'
import Loader from '@/app/_components/Loader'
import { errorAlert } from '@/app/_components/Alerts'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

export default function Signup() {
  const router = useRouter()

  const initialState = { fullName: '', username: '', email: '', password: '' }
  const [user, setUser] = useState(initialState)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [loading, setLoading] = useState(false)

  const signup = async () => {
    setLoading(true)
    setButtonDisabled(true)

    await axios
      .post('/api/users/signup', user)
      .then((response) => {
        if (response.status === 200) {
          setUser(initialState)
          router.push('/edit/profile')
        }
      })
      .catch((err) => {
        errorAlert(err.response.data.error)
        setUser(initialState)
      })
      .finally(() => {
        setLoading(false)
        setButtonDisabled(false)
      })
  }

  useEffect(() => {
    if (
      user.fullName.length > 0 &&
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])

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
            Sign up to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' action='#' method='POST'>
            <div>
              <label
                htmlFor='fullName'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Full name
              </label>
              <div className='mt-2'>
                <input
                  id='fullName'
                  name='fullName'
                  type='text'
                  value={user?.fullName}
                  onChange={(e) => {
                    setUser({ ...user, fullName: e.target.value })
                  }}
                  autoComplete='name'
                  required
                  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Username
              </label>
              <div className='mt-2'>
                <input
                  id='username'
                  name='username'
                  type='text'
                  value={user?.username}
                  onChange={(e) => {
                    setUser({ ...user, username: e.target.value })
                  }}
                  autoComplete='username'
                  required
                  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={user?.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value })
                  }}
                  autoComplete='email'
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
                  <a
                    href='#'
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={user?.password}
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value })
                  }}
                  autoComplete='current-password'
                  required
                  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <button
                type='button'
                onClick={signup}
                disabled={buttonDisabled ? true : false}
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                {loading ? <Loader /> : 'Sign up'}
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            Already a member?{' '}
            <Link
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
              href='/signin'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
