import { Badge } from "../components/ui/Badge";

export const orderStatusBadge = (status: string) => {
  const map: Record<string, { variant: 'green' | 'yellow' | 'red'; label: string }> = {
    completed: { variant: "green", label: "Completed" },
    pending:   { variant: "yellow", label: "Pending"   },
    cancelled: { variant: "red", label: "Cancelled" },
  };
  const config = map[status] || { variant: "gray" as any, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const stockBadge = (s: string, stock: number) => {
  if (s === "out") return <Badge variant="red">Out of Stock</Badge>;
  if (s === "low") return <Badge variant="orange">Low ({stock})</Badge>;
  return <Badge variant="green">{stock} in stock</Badge>;
};