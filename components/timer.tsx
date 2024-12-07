import { ReactNode, useState, useRef, useEffect } from "react";

export default function Timer({
  title,
  second,
  children,
}: {
  title: string;
  second: number;
  children: ReactNode;
}) {
  const [startTime, setStartTime] = useState<number>(second);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (startTime === 0) return;
    intervalRef.current = setInterval(() => setStartTime(startTime - 1), 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime]);

  return (
    <div>
      <p className="md:text-base text-sm text-blue-500">
        {title} {startTime} s
      </p>
      <div className={`${startTime === 0 ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}
