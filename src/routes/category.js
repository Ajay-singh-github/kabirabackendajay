import express from 'express';
var router = express.Router();
import upload from "../middlewares/multer.midddleware.js";
import Category from "../models/categories.model.js";
import verifyTokenAndRole from '../middlewares/auth.middleware.js';

router.post('/add_new_category',verifyTokenAndRole(["admin"]), upload.single("image"), function (req, res, next) {
  try {
    var { name } = req.body
    var category = new Category({ "name": name, "image": req.file.filename  })
    category.save().then((saveData) => {
      if (category == saveData) {
        
        res.status(200).json({ status: true, message: "Submitted Successfully" })

      } else {
        res.status(200).json({ status: false, message: "Database Error" })
      }
    })
  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })
  }
});


router.get('/get_all_category',async function(req, res, next) {
    try{
    var category = await Category.find()  
    res.status(200).json({ status: true, message: "Get Data Successfully",data:category })
    }catch(e){
        res.status(500).json({ status: false, message: "Server Error" })
      }
    });


router.post('/get_specific_category',verifyTokenAndRole(["admin"]), async function (req, res, next) {
  try {
    var { categoryid } = req.body
    var category = await Category.findOne({ _id: categoryid })
    res.status(200).json({ status: true, message: "Get Data Successfully", data: category })
  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })
  }
});


router.put('/update_category',verifyTokenAndRole(["admin"]), upload.single("image"), async function (req, res, next) {
  try {
    const { categoryid } = req.body
    const updateData = {...req.body,"image": req.file.filename}
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryid },          // Search condition
      { $set: updateData },      // Updated data
      { new: true }              // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedCategory
    });

  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })

  }

});

router.delete('/delete_category',verifyTokenAndRole(["admin"]), async function (req, res, next) {
  try {
    const { categoryid } = req.body

    const deletedCategory = await Category.findOneAndDelete({ _id: categoryid });
    if (!deletedCategory) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Category deleted successfully",
      data: deletedCategory
    });

  } catch (e) {
    res.status(500).json({ status: false, message: "Server Error" })
  }
});

export default router;
