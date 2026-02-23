"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import logo from "@/components/header/logo_main.png"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

function MenuButton({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }

  const button = (
    <button
      type="button"
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="fixed top-0 right-0 z-[60] h-[80px] md:h-[140px] flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[60px] bg-transparent border-none cursor-pointer"
    >
      <span className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full border border-red-500 bg-transparent hover:bg-white/10 flex items-center justify-center">
        {isOpen ? (
          <span className="relative w-6 h-6">
            <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-red-500 -translate-y-1/2 rotate-45"></span>
            <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-red-500 -translate-y-1/2 -rotate-45"></span>
          </span>
        ) : (
          <span className="flex flex-col gap-1.5">
            <span className="w-6 h-0.5 bg-red-500"></span>
            <span className="w-6 h-0.5 bg-red-500"></span>
            <span className="w-6 h-0.5 bg-red-500"></span>
          </span>
        )}
      </span>
    </button>
  )

  if (!mounted) {
    return null
  }

  return createPortal(button, document.body)
}

interface AnniversaryNavProps {
  sections: ReadonlyArray<{ id: string; label: string }>
}

export function AnniversaryNav({ sections }: AnniversaryNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 300)
  }

  return (
    <>
      {/* メニューボタン */}
      <MenuButton
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />

      {/* メニューパネル */}
      <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <SheetContent
          hideCloseButton
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="!z-50 !w-full !max-w-full !left-0 !right-0 !top-0 !h-full md:!w-[calc(100vw-40px)] md:!left-[20px] md:!right-[20px] md:!top-[20px] md:!h-[calc(100vh-40px)] rounded-none md:rounded-[10px] [&]:data-[state=open]:!fade-in-0 [&]:data-[state=closed]:!fade-out-0 [&]:data-[state=open]:!slide-in-from-right-0 [&]:data-[state=closed]:!slide-out-to-right-0 !bg-transparent !p-0 overflow-hidden"
        >
          <SheetTitle className="sr-only">メニュー</SheetTitle>
          <nav className="h-full w-full rounded-none md:rounded-[10px] overflow-y-auto bg-black">
            <div className="p-20 flex flex-col gap-4">
              {/* ロゴ */}
              <div className="mb-4 flex justify-center">
                <Image src={logo} alt="IK ALUMNI CGT" width={200} height={112} className="h-auto" />
              </div>

              {/* セクションリンク */}
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-left text-base font-medium text-white hover:text-white/60 transition-colors pb-4 border-b border-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
