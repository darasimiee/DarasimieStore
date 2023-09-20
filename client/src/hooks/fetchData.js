import { useState, useEffect } from "react";

export default function useFetchData(url, options, token) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() =>
  {
    if(!url) return
    const fetchData = async () =>
    {setLoading(true)
      try {
        const res = await url(options, token)
        setData(res.data)
      } catch (error) 
      {
        console.log(error);
        setError(error)
      }finally
      {
        setLoading(false)
      }
    }
    fetchData()
  }, [url, options, token])

  return {data, error, loading, setData}
}