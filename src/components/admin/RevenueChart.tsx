import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Legend, ResponsiveContainer } from "recharts";

interface Payment {
  id: string;
  amount: number;
  status: string;
  plan_type: string;
}

interface RevenueChartProps {
  payments: Payment[];
}

const chartConfig = {
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-4))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueChart({ payments }: RevenueChartProps) {
  const revenueData = useMemo(() => {
    const approved = payments
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const rejected = payments
      .filter((p) => p.status === "rejected")
      .reduce((sum, p) => sum + p.amount, 0);

    return [
      { name: "Approved", value: approved, fill: "hsl(var(--chart-2))" },
      { name: "Pending", value: pending, fill: "hsl(var(--chart-4))" },
      { name: "Rejected", value: rejected, fill: "hsl(var(--chart-1))" },
    ];
  }, [payments]);

  const totalApproved = revenueData[0].value;
  const totalPending = revenueData[1].value;

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-light flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Revenue Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground">Total Approved</p>
            <p className="text-lg font-semibold text-green-500">
              {formatCurrency(totalApproved)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-semibold text-yellow-500">
              {formatCurrency(totalPending)}
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={revenueData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={70}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
