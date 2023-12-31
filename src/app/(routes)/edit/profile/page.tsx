'use client'

import Loader from '@/app/_components/Loader'
import { IUser } from '@/app/interfaces'
import axios from 'axios'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
// import { debounce } from 'lodash'
import { useRouter } from 'next/navigation'
import { File } from 'buffer'
import FullPageLoader from '@/app/_components/FullPageLoader'
import { flushSync } from 'react-dom'
import { ToastContainer } from 'react-toastify'
import { successAlert } from '@/app/_components/Alerts'
import useCheckEmail from '@/app/hooks/useCheckEmail'
import useCheckUsername from '@/app/hooks/useCheckUsername'

function debounce(fn: any, delay = 1000) {
  let timeout: any

  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export default function EditProfile() {
  const router = useRouter()

  const initialState = {
    fullName: '',
    username: '',
    email: '',
    address: '',
    imageUrl: '',
    imageName: '',
    isImageChanged: false,
  }
  const [user, setUser] = useState<IUser & { isImageChanged?: boolean }>(
    initialState
  )

  const { validEmail, setValidEmail, isEmailUsed } = useCheckEmail()
  const { validUsername, setValidUsername, isUsernameUsed } = useCheckUsername()

  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(key: keyof IUser, value: string) {
    setUser({ ...user, [key]: value })

    if (key === 'email') {
      if (value === '') {
        setValidEmail({
          isValid: false,
          message: 'Email cannot be empty',
          loading: false,
        })
      }
      isEmailUsed(value)
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

  async function fetchUser() {
    const response = await axios
      .get('/api/users/me')
      .finally(() => setLoading(false))

    if (response.status === 200) {
      setUser(response.data.user)
    }
  }

  async function saveChanges() {
    if (user.isImageChanged) await handleImageChange(inputRef.current!)

    const { status } = await axios.put('/api/users/me', user)

    if (status === 200) {
      successAlert('Updated successfully')
      router.push('/dashboard')
    }
  }

  function generateImagePreview(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    let reader = new FileReader()
    reader.onload = (e) => {
      user.isImageChanged = true
      handleChange('imageUrl', (e.target as any).result)
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const handleImageChange = async (input: HTMLInputElement) => {
    const formData = new FormData()
    const files = Array.from(input.files ?? [])
    for (const file of files) {
      formData.append(file.name, file)
    }

    const { data } = await axios.post('/api/upload', formData)
    user.imageName = data.filename
    delete user.isImageChanged
  }

  function cancelChanges() {
    router.push('/dashboard')
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      {loading && <FullPageLoader />}
      <ToastContainer />
      <div style={{ width: '80%' }} className='m-auto mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-black text-5xl not-italic font-semibold'>
            Edit profile
          </h2>
          <div
            style={{
              backgroundImage: `url("${user?.imageUrl}")`,
            }}
            className='w-32 h-32 flex-shrink-0 rounded-full bg-center bg-no-repeat bg-cover'
          >
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                fontSize: 60,
              }}
              className='w-full h-full rounded-full flex items-center justify-center text-slate-200 mb-3 pb-2'
            >
              <label className='cursor-pointer' htmlFor='imageUrl'>
                +
              </label>
              <input
                id='imageUrl'
                ref={inputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  generateImagePreview(e)
                }}
                className='hidden'
                type='file'
              />
            </div>
          </div>
        </div>
        <div className='mt-12'>
          <Input
            handleChange={handleChange}
            value={user?.fullName!}
            label='Full Name'
            id='fullName'
          />
          <Input
            handleChange={handleChange}
            value={user?.username!}
            label='Username'
            id='username'
            validation={validUsername}
          />
          <Input
            handleChange={handleChange}
            value={user?.email!}
            label='Email'
            id='email'
            validation={validEmail}
          />
          <Input
            handleChange={handleChange}
            value={user?.address!}
            label='Address'
            id='address'
          />
        </div>

        <div className='mt-12 flex justify-between w-1/3'>
          <CancelButton cancelChanges={cancelChanges} />
          <SaveButton saveChanges={saveChanges} />
        </div>
      </div>
    </>
  )
}

interface IInput {
  handleChange: (key: keyof IUser, value: string) => void
  value: string
  label: string
  id: string
  validation?: { isValid: boolean; message: string; loading: boolean }
}

function Input({ handleChange, value, label, id, validation }: IInput) {
  const { isValid, message, loading } = validation || {
    isValid: true,
    message: '',
    loading: false,
  }

  return (
    <div className='mb-4'>
      <label
        className={`${
          isValid ? 'text-gray-900' : 'text-red-600'
        } text-2xl not-italic font-semibold`}
        htmlFor={id}
      >
        {loading ? <Loader /> : isValid ? label : message}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e: React.SyntheticEvent) =>
          handleChange(id as keyof IUser, (e.currentTarget as any).value)
        }
        style={{
          height: '70px',
          borderRadius: '5px',
          border: isValid ? '2px solid #858585' : '2px solid red',
          background: '#FFF',
        }}
        className='text-gray-600 text-2xl not-italic font-medium pl-3 outline-none w-full mt-2'
        type='text'
        placeholder={label}
      />
    </div>
  )
}

function CancelButton({ cancelChanges }: { cancelChanges: () => void }) {
  return (
    <button
      type='button'
      onClick={cancelChanges}
      className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 transition'
    >
      Cancel
    </button>
  )
}

function SaveButton({ saveChanges }: { saveChanges: () => void }) {
  return (
    <button
      onClick={saveChanges}
      type='button'
      className='transition px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
    >
      Save changes
    </button>
  )
}
