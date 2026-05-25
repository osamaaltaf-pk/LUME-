export const cashOnDelivery = async (req, res) => {
  try {
    const { customerName, totalAmount, address } = req.body;

    res.status(200).json({
      success: true,
      message: 'Cash on Delivery order placed successfully',
      order: {
        customerName,
        totalAmount,
        address,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
