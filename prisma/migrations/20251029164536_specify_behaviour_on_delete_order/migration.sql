-- DropForeignKey
ALTER TABLE "public"."ProductOrder" DROP CONSTRAINT "ProductOrder_order_id_fkey";

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
