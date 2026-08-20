import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { Booking } from "@/models/Booking";
import { Payment } from "@/models/Payment";
import { EmailLog } from "@/models/EmailLog";
import { GalleryImage } from "@/models/GalleryImage";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [
    bookingsTotal,
    bookingsInquiry,
    bookingsConfirmed,
    paymentsPaid,
    paymentsPending,
    revenueAgg,
    emailsTotal,
    emailsFailed,
    imagesTotal,
    imagesSelected,
    recentBookings,
    recentEmails,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "inquiry" }),
    Booking.countDocuments({ status: "confirmed" }),
    Payment.countDocuments({ status: "paid" }),
    Payment.countDocuments({ status: "pending" }),
    Payment.aggregate([
      { $match: { status: { $in: ["paid", "partial"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    EmailLog.countDocuments(),
    EmailLog.countDocuments({ status: "failed" }),
    GalleryImage.countDocuments(),
    GalleryImage.countDocuments({ selected: true }),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
    EmailLog.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return NextResponse.json({
    stats: {
      bookingsTotal,
      bookingsInquiry,
      bookingsConfirmed,
      paymentsPaid,
      paymentsPending,
      revenue: revenueAgg[0]?.total ?? 0,
      emailsTotal,
      emailsFailed,
      imagesTotal,
      imagesSelected,
    },
    recentBookings,
    recentEmails,
  });
}
