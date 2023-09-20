import axios from 'axios'

export const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL
})