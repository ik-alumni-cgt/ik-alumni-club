type Props = {
  src: string
  className?: string
}

// soco-st の SVG（public/cheerly/icons）を currentColor で着色して表示する。
// mask を使うことで <img> では効かない色指定（ブランドブルー）を可能にする。
export function MaskIcon({ src, className }: Props) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  )
}
