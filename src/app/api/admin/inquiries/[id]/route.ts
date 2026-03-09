import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Inquiry from "@/models/Inquiry";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      {
        ...(body.status && { status: body.status }),
        ...(body.adminNote !== undefined && { adminNote: body.adminNote }),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
