'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useGetConfig} from "@/lib/client/query";

export default function Home() {
  const router = useRouter()
  const {data} = useGetConfig()

  useEffect(() => {
    if (data === null) {
      router.push('/setup')
    } else {
      router.push('/collections')
    }
  }, [data, router]);

  return null
}
