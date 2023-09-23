'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useGetCollections, useGetConfig} from "@/lib/client/query";

export default function CollectionsPage() {
  const router = useRouter()
  const {data: config} = useGetConfig()
  const {data: collections} = useGetCollections(config)

  useEffect(() => {
    console.log(collections)
    if (collections != null) {
      router.push(`/collections/${collections[0].name}`)
    }
  }, [collections, router]);

  return null
}
