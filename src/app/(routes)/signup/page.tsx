'use client'

import axios from 'axios'
import Link from 'next/link'
import Loader from '@/app/_components/Loader'
import { errorAlert } from '@/app/_components/Alerts'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import useCheckEmail from '@/app/hooks/useCheckEmail'
import useCheckUsername from '@/app/hooks/useCheckUsername'

interface ISignupData {
  fullName: string
  username: string
  email: string
  password: string
}

export default function Signup() {
  const router = useRouter()

  const { validEmail, setValidEmail, isEmailUsed } = useCheckEmail()
  const { validUsername, setValidUsername, isUsernameUsed } = useCheckUsername()

  const initialState = { fullName: '', username: '', email: '', password: '' }
  const [user, setUser] = useState<ISignupData>(initialState)
  const [loading, setLoading] = useState(false)

  const signup = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setLoading(true)

    await axios
      .post('/api/users/signup', user)
      .then((response) => {
        if (response.status === 200) {
          setUser(initialState)
          router.push('/edit/profile')
        }
      })
      .catch((err) => {
        console.log(err)

        errorAlert(err.response.data.error)
        setUser(initialState)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (key: keyof ISignupData, value: string) => {
    setUser({ ...user, [key]: value })

    if (key === 'email') {
      if (value === '') {
        return setValidEmail({
          isValid: false,
          message: 'Email cannot be empty',
          loading: false,
        })
      }
      isEmailUsed(value)
      return
    }

    if (key === 'username') {
      if (value === '') {
        return setValidUsername({
          isValid: false,
          message: 'Email cannot be empty',
          loading: false,
        })
      }
      isUsernameUsed(value)
    }
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
            Sign up to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            onSubmit={signup}
            className='space-y-6'
            action='#'
            method='POST'
          >
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
                    handleChange('fullName', e.target.value)
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
                className={`block text-sm font-medium leading-6 ${
                  validUsername.isValid ? 'text-gray-900' : 'text-red-600'
                }`}
              >
                {validUsername.loading ? (
                  <Loader />
                ) : validUsername.isValid ? (
                  'Username'
                ) : (
                  validUsername.message
                )}
              </label>
              <div className='mt-2'>
                <input
                  id='username'
                  name='username'
                  type='text'
                  value={user?.username}
                  style={{
                    border: validUsername.isValid
                      ? '2px solid #858585'
                      : '2px solid red',
                  }}
                  onChange={(e) => {
                    handleChange('username', e.target.value)
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
                  className={`block text-sm font-medium leading-6 ${
                    validEmail.isValid ? 'text-gray-900' : 'text-red-600'
                  }`}
                >
                  {validEmail.loading ? (
                    <Loader />
                  ) : validEmail.isValid ? (
                    'Email'
                  ) : (
                    validEmail.message
                  )}
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={user?.email}
                  style={{
                    border: validEmail.isValid
                      ? '2px solid #858585'
                      : '2px solid red',
                  }}
                  onChange={(e) => {
                    handleChange('email', e.target.value)
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
                    handleChange('password', e.target.value)
                  }}
                  autoComplete='current-password'
                  required
                  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
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
