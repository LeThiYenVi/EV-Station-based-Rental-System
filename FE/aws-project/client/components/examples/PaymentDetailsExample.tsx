import { useEffect, useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { paymentService } from "@/service";
import type { PaymentResponse } from "@/service";

interface PaymentDetailsProps {
  bookingId: string;
}

/**
 * Example Payment Details Component
 */
export default function PaymentDetailsExample({
  bookingId,
}: PaymentDetailsProps) {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const { getPaymentsByBookingId, loading, error } = usePayment();

  useEffect(() => {
    loadPayments();
  }, [bookingId]);

  const loadPayments = async () => {
    const result = await getPaymentsByBookingId(bookingId);
    if (result) {
      setPayments(result);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    const color = paymentService.getStatusColor(status);
    const variantMap: Record<string, any> = {
      yellow: "warning",
      blue: "default",
      green: "success",
      red: "destructive",
      orange: "warning",
      gray: "secondary",
    };
    return variantMap[color] || "default";
  };

  if (loading && payments.length === 0) {
    return <div className="text-center py-10">Loading payment details...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment Information</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No payment records found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Payment #{payment.id.substring(0, 8)}
                  </CardTitle>
                  <Badge variant={getStatusBadgeVariant(payment.status)}>
                    {paymentService.getStatusText(payment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      {paymentService.formatAmount(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={paymentService.getMethodIcon(payment.method)}
                        alt={payment.method}
                        className="h-6 w-auto"
                      />
                      <p className="font-medium">
                        {paymentService.getMethodText(payment.method)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">
                      {paymentService.formatPaymentDate(payment.createdAt)}
                    </p>
                  </div>
                  {payment.paidAt && (
                    <div>
                      <p className="text-sm text-gray-500">Paid At</p>
                      <p className="font-medium">
                        {paymentService.formatPaymentDate(payment.paidAt)}
                      </p>
                    </div>
                  )}
                  {payment.transactionId && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm">
                        {payment.transactionId}
                      </p>
                    </div>
                  )}
                  {payment.orderId && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono text-sm">{payment.orderId}</p>
                    </div>
                  )}
                </div>

                {paymentService.isPaymentPending(payment) && payment.payUrl && (
                  <div className="mt-4">
                    <a
                      href={payment.payUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Complete Payment
                    </a>
                  </div>
                )}

                {paymentService.isPaymentCompleted(payment) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-green-800 font-medium">
                        Payment completed successfully
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
