'use client'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const Slug = (props: Props) => {
    const params = useParams()
    const {slug} = params
    console.log("SLUG::", slug)
  return (
    <div>Slug</div>
  )
}

export default Slug