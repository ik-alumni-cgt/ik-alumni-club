type DetailTitleProps = {
  title: string;
};

export function DetailTitle({ title }: DetailTitleProps) {
  return (
    <h1 className="text-[22px] font-bold text-black leading-relaxed">
      {title}
    </h1>
  );
}
