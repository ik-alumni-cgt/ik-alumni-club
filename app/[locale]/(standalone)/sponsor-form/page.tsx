"use client"

import { SponsorForm } from "@/components/sponsor-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import supportersLogo from "@/components/supporters/top_supporter's.jpg"
import { useState } from "react"

export default function SponsorFormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Image
            src={supportersLogo}
            alt="IK ALUMNI CGT SUPPORTER'S CLUB"
            width={300}
            height={169}
            placeholder="blur"
            className="object-contain"
          />
        </div>
        <Card>
          {!isSubmitted && (
            <CardHeader>
              <CardTitle>スポンサー回答フォーム</CardTitle>
              <CardDescription>
                以下の項目にご回答ください。回答いただいた内容は、コンサートプログラムやホームページへの掲載に使用させていただきます。
              </CardDescription>
            </CardHeader>
          )}
          <CardContent className={isSubmitted ? "pt-6" : ""}>
            <SponsorForm onSubmitSuccess={() => setIsSubmitted(true)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
