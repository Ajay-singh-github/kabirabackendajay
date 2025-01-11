import express from 'express';
var router = express.Router();
import upload from "../middlewares/multer.midddleware.js";
import Product from "../models/product.model.js";
import verifyTokenAndRole from '../middlewares/auth.middleware.js';

router.post('/add_new_product',verifyTokenAndRole(["admin"]), upload.any(), async (req, res) => {
  try {
      const fileNames = req.files.map(file => file.filename);
      const body = { ...req.body, image: fileNames };
      const product = new Product(body);
      const saveData = await product.save();

      if (saveData) {
          res.status(200).json({ status: true, message: "Product added successfully", data: saveData });
      } else {
          res.status(400).json({ status: false, message: "Database error" });
      }
  } catch (error) {
    console.log("55555555555555555555555555:",error)
      res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

router.get('/get_all_product',async function(req, res, next) {
    try {
     Product.aggregate(
          [
            {
                $lookup: {
                  from: "categories",
                  localField: "categoryid",
                  foreignField: "_id",
                  as: "categoryDetails",
                },
              } 
            ],
            { $unwind: "$categoryDetails" },
            {
                $project: {
                  _id: 1,
                  name: 1,
                  description: 1,
                  sku: 1,
                  stockquantity: 1,
                  regularprice: 1,
                  saleprice: 1,
                  tags: 1,
                  image: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  categoryid: 1,

                  categoryDetails: {
                    _id: 1,
                    name: 1,
                  },
                },
              },
          ).then((result) => {
            res.status(200).json({ status: true, message: "Fetched Successfully", data: result })
      
          }).catch((e) => {
            res.status(200).json({ status: false, message: "Database Error", data: e })
          })
      } catch {
    
      }
    });


router.post('/get_specific_products_by_category',async function(req, res, next) {
    try{
    var {categoryid} = req.body
    var product = await Product.find({categoryid:categoryid})  
    res.status(200).json({ status: true, message: "Get Data Successfully",data:product })
    }catch(e){
        res.status(500).json({ status: false, message: "Server Error" })

      }
    });

router.post('/get_specific_product', async function (req, res, next) {
  try {
    var { productid } = req.body
    var product = await Product.findOne({ _id: productid })
    res.status(200).json({ status: true, message: "Get Data Successfully", data: product })
  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })

  }
});


router.put('/update_product',verifyTokenAndRole(["admin"]),upload.any(), async function (req, res, next) {
  try {
    const fileNames = req.files.map(file => file.filename);
    const { productid } = req.body
    const updateData = {...req.body,"image": fileNames}
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productid },          // Search condition
      { $set: updateData },      // Updated data
      { new: true }              // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "updated successfully",
      data: updatedProduct
    });

  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })
  }

});

router.delete('/delete_product',verifyTokenAndRole(["admin"]), async function (req, res, next) {
  try {
    const { productid } = req.body

    const deletedProduct = await Product.findOneAndDelete({ _id: productid });
    if (!deletedProduct) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });

  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })
  }
});


router.get('/total-revenue_of_product',verifyTokenAndRole(["admin"]), async (req, res) => {
    try {
      const totalSales = await Product.aggregate([
        {
          $group: {
            _id: null, // No grouping by a specific field, so we keep it null
            totalAmount: { $sum: "$regularprice" } // Sum the paymentamount field
          }
        }
      ]);
  
      const totalAmount = totalSales.length > 0 ? totalSales[0].totalAmount : 0;
  
      res.status(200).json({
        status: true,
        message: "Total Revenue calculated successfully",
        totalRevenue: totalAmount
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error calculating total sales",
        error: error.message
      });
    }
  });


  router.get('/search', async (req, res) => {
    const { searchTerm } = req.query;
  
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required.', status: false });
    }
  
    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryid",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" }, // Unwind to access category name for searching
        {
          $match: {
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } }, // Search in product name
              { description: { $regex: searchTerm, $options: 'i' } }, // Search in product description
              { "categoryDetails.name": { $regex: searchTerm, $options: 'i' } } // Search in category name
            ],
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            sku: 1,
            stockquantity: 1,
            regularprice: 1,
            saleprice: 1,
            tags: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            categoryid: 1,
            categoryDetails: {
              _id: 1,
              name: 1,
              image: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        },
      ]);
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found.', status: false });
      }
  
      res.status(200).json({ status: true, products });
    } catch (error) {
      console.error('Error during search:', error);
      res.status(500).json({ message: 'An error occurred while searching for products.', status: false });
    }
  });
  

router.get('/get_all_product_best_saller', async function(req, res, next) {
  try {
    Product.aggregate(
      [
        {
          $lookup: {
            from: "categories",
            localField: "categoryid",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            sku: 1,
            stockquantity: 1,
            regularprice: 1,
            saleprice: 1,
            tags: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            categoryid: 1,
            categoryDetails: {
              _id: 1,
              name: 1,
            },
          },
        },
        { $limit: 3 }, 
      ]
    ).then((result) => {
      res.status(200).json({ status: true, message: "Fetched Successfully", data: result });
    }).catch((e) => {
      res.status(200).json({ status: false, message: "Database Error", data: e });
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error", data: error });
  }
});

export default router;
