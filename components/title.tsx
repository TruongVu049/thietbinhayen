interface TitleProps {
  title?: string;
  description?: string;
  children?: string | JSX.Element | JSX.Element[];
}

export default function Title({ title, description, children }: TitleProps) {
  return (
    <div>
      <h6 className="md:text-lg text-base font-bold text-rose-500 flex items-center gap-3 ">
        <span className="block w-4 h-6 bg-rose-500 rounded-md"></span>
        {title && title}
        {children && children}
      </h6>
      <h5 className="mt-2 md:text-2xl text-xl font-bold text-gray-950">
        {description && description}
      </h5>
    </div>
  );
}
