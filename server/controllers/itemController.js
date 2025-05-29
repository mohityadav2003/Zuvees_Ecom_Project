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
        const id = req.params.id;
        if(!id){
           return res.status(400).json({
            message: "please provide id"
           })
        }
        const item = await Item.findOne({ _id: id });
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

exports.createItem = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Only admins can create items."
            });
        }

        const { name, description, price, category, image, variations } = req.body;

        // Validate required fields and variations
        if (!name || !price || !category || !variations || variations.length === 0) {
            return res.status(400).json({
                message: "Name, price, category, and at least one variation are required fields"
            });
        }

        // Create new item with variations
        const item = new Item({
            name,
            description,
            price,
            category,
            image,
            variations // Save the variations array
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

exports.updateItem = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can update items." });
        }
        const { id } = req.params;
        const update = req.body;

        // Find and update item
        const item = await Item.findByIdAndUpdate(id, update, { new: true });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated successfully", item });

    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ message: "Error updating item", error: error.message });
    }
};