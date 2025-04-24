import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function PUT(req: Request) {
  const {
    storeID,
    itemID,
    updatedItemName,
    updatedItemDescription,
    updatedItemPrice,
    compareAtPrice,
    costPerItem,
    quantity,
    itemImages // optional: updated array of base64 images
  } = await req.json();

  if (!storeID || !itemID || !updatedItemName || !updatedItemDescription || updatedItemPrice == null) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  try {
    await connectToDB();

    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemID, storeID },
      {
        itemName: updatedItemName,
        itemDescription: updatedItemDescription,
        itemPrice: updatedItemPrice,
        compareAtPrice,
        costPerItem,
        quantity,
        ...(itemImages && itemImages.length > 0 && { itemImages }) // Optional override
      },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated successfully!", item: updatedItem });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
