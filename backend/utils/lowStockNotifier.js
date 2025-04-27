    import Product from "../models/Product.model.js";
    import { sendEmail } from "./emailVerification.js";

    export const notifyAdminOfLowStock = async () => {
        try {
            const lowStockProducts = await Product.find({ stock: { $lt: 5 }});

            if(lowStockProducts.length > 0) {
                await sendEmail(
                    "mikusama301@gmail.com",
                    "Low Stock Alert",
                    `The following products are running low: ${lowStockProducts.map(p => p.name).join(", ")}`

                );
                console.log("Low stock email notification was sent");

            }
        } catch (error) {
            console.error("Error sending low stock notification", error.message);
            
        }
    };
