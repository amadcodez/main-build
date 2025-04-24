import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      storeID,
      itemName,
      itemDescription,
      itemPrice,
      compareAtPrice,
      costPerItem,
      quantity,
      itemImages,
    } = body;

    // Validate that images array is proper
    if (!Array.isArray(itemImages) || itemImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required." },
        { status: 400 }
      );
    }

    // Optional: Validate each image
    for (const img of itemImages) {
      if (!img.startsWith("data:image")) {
        return NextResponse.json(
          { success: false, message: "Invalid image format in one of the files." },
          { status: 400 }
        );
      }
    }

    // Connect to DB
    await connectToDB();

    // Create item
    const newItem = new Item({
      storeID,
      itemName,
      itemDescription,
      itemPrice,
      compareAtPrice,
      costPerItem,
      quantity,
      itemImages, // Store as array of base64 images
    });

    await newItem.save();

    return NextResponse.json({
      success: true,
      message: "Item added successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
