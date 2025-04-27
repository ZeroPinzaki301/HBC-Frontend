export const ORDER_STATUS = {
    PENDING: "Pending",
    PREPARING: "Preparing",
    DELIVERING: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELED: "Canceled"
};
  
  export const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PREPARING:
        return "text-yellow-600";
      case ORDER_STATUS.CANCELED:
        return "text-red-600";
      case ORDER_STATUS.DELIVERED:
        return "text-green-600";
      default:
        return "text-gray-600";
    }
};