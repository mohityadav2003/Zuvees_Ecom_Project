const express = require('express');
const Item = require('../models/item')

exports.getAllItems = async (req,res)=>{
    try{
        const allitems = await Item.find();
        return res.status(200).json(allitems);
    }
    catch(err){
        res.status(500).json({
             error: "Failed to fetch Items",
             err: err
         });
    }
};

exports.getById = async (req,res)=>{
    try{
        const id = req.body.id;
        if(!id){
           return res.status(400).json({
            message: "please provide id"
           })
        }
        const item = Item.findOne({
            id
        });
        if(!item){
            return res.status(400).json({
                message: "no item found",
            });
        }
        return res.status(200).json(item);
    }
    catch(err){
        res.status(500).json({
            message: "Internal Server Error",
            err : err
        })
    }
};

exports.addItem = async(req,res)=>{
    try{
        const item = req.body;
        if(!item){
            return res.status(401).json({
                message: "Invalid Request"
            })
        }
        const title = req.body.title;
        const des = req.body.description;
        const price = req.body.price;

        if(!title || !des || !price){
            return res.status(400).json({
                message: "Please send Complete Details of Item",
            })
        };

        const newItem = new Item({
            title: title,
            description: des,
            price : price
        });

        newItem.save();

        return res.status(200).json({
            message: "Item Submitted Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            err : err
        })
    }
}

exports.createItem = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Only admins can create items."
            });
        }

        const { name, description, price, category, image, stock } = req.body;

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({
                message: "Name, price, and category are required fields"
            });
        }

        // Create new item
        const item = new Item({
            name,
            description,
            price,
            category,
            image,
            stock: stock || 0
        });

        await item.save();

        res.status(201).json({
            message: "Item created successfully",
            item
        });

    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({
            message: "Error creating item",
            error: error.message
        });
    }
};