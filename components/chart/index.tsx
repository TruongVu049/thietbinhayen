"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { HoaDon } from "@/lib/db/types";
import { useEffect, useState } from "react";
import { groupByMonthAndCalculateTotal } from "@/helpers/utils";
import ExportExcel from "../handleFile/exportExcel";

const chartConfig = {
  doanhthu: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ChartComponentProps = {
  title: string;
  dataKey: string;
  dataName: string;
  action: ({
    year,
    month,
  }: {
    year: number;
    month: number;
  }) => Promise<HoaDon[]>;
};
const ChartComponent: React.FC<ChartComponentProps> = ({
  title,
  dataKey,
  dataName,
  action,
}) => {
  const [data, setData] = useState<HoaDon[]>();
  const [selectedTime, setSelectedTime] = useState<{
    year: number;
    month: number;
  }>({
    year: 2024,
    month: 0,
  });

  useEffect(() => {
    let ignore = false;
    action(selectedTime)
      .then((result) => {
        if (!ignore) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
        console.log(errorMessage);
      });
    return () => {
      ignore = true;
    };
  }, [selectedTime]);

  return (
    <div className="">
      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {title}
              <span className="w-auto ml-auto">
                <ExportExcel outputName="ThongKeDoanhThu" data={data}>
                  Xuất file
                </ExportExcel>
              </span>
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 justify-end  mb-2">
                <label
                  htmlFor="sl-year"
                  className="flex items-center gap-2 text-gray-700 md:text-base text-sm"
                >
                  Năm:
                  <select
                    onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                      setSelectedTime({
                        ...selectedTime,
                        year: Number(e.currentTarget.value) ?? 2024,
                      });
                    }}
                    name="year"
                    className="py-2 px-4 rounded-md border"
                  >
                    <option value="2024">2024</option>
                  </select>
                </label>
                <label
                  htmlFor="sl-month"
                  className="flex items-center gap-2 text-gray-700 md:text-base text-sm"
                >
                  Tháng:
                  <select
                    name="month"
                    className="py-2 px-4 rounded-md border"
                    onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                      setSelectedTime({
                        ...selectedTime,
                        month: Number(e.currentTarget.value) ?? 0,
                      });
                    }}
                  >
                    <option value="0">Tất cả</option>
                    {new Array(12).fill(1).map((item, index) => (
                      <option value={index + 1} key={index}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={groupByMonthAndCalculateTotal(selectedTime.month, data)}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={dataKey}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey={dataName}
                  fill={`var(--color-${dataName})`}
                  radius={4}
                >
                  <LabelList
                    position="top"
                    offset={8}
                    className="fill-foreground font-bold"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChartComponent;
