"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getImport } from "@/lib/db";
import { PhieuNhap } from "@/lib/db/types";

const chartConfig = {
  1: { label: "Tháng 1", color: "hsl(var(--chart-1))" },
  2: { label: "Tháng 2", color: "hsl(var(--chart-2))" },
  3: { label: "Tháng 3", color: "hsl(var(--chart-3))" },
  4: { label: "Tháng 4", color: "hsl(var(--chart-4))" },
  5: { label: "Tháng 5", color: "hsl(var(--chart-5))" },
  6: { label: "Tháng 6", color: "hsl(var(--chart-1))" },
  7: { label: "Tháng 7", color: "hsl(var(--chart-2))" },
  8: { label: "Tháng 8", color: "hsl(var(--chart-3))" },
  9: { label: "Tháng 9", color: "hsl(var(--chart-4))" },
  10: { label: "Tháng 10", color: "hsl(var(--chart-5))" },
  11: { label: "Tháng 11", color: "hsl(var(--chart-1))" },
  12: { label: "Tháng 12", color: "hsl(var(--chart-2))" },
};

export function PieChartComponent() {
  const [chartData, setChartData] = React.useState<
    { month: string; chiPhi: number; fill: string }[]
  >([]);

  const processImportData = (data: PhieuNhap[]) => {
    const monthlyTotals: { [key: number]: number } = {};

    data.forEach((item) => {
      const month = new Date(item.ngaytao as Date).getMonth() + 1; // Lấy tháng (0-indexed nên +1)
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += item.tongtien; // Cộng dồn tổng tiền
    });

    const result = Object.entries(monthlyTotals).map(([month, chiPhi]) => {
      const monthNumber = parseInt(month, 10) as keyof typeof chartConfig;
      return {
        month: chartConfig[monthNumber]?.label || `Tháng ${monthNumber}`,
        chiPhi,
        fill: chartConfig[monthNumber]?.color || "hsl(var(--chart-default))",
      };
    });

    return result;
  };

  React.useEffect(() => {
    let ignore = false;

    getImport()
      .then((result) => {
        if (!ignore) {
          const processedData = processImportData(result);
          setChartData(processedData); // Cập nhật dữ liệu
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
  }, []);

  const totalCost = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.chiPhi, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Chi Chí Nhập Hàng</CardTitle>
        <CardDescription>Năm 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="chiPhi"
              nameKey="month"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCost.toLocaleString()} VND
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
