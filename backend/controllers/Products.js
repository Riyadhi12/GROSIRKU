import Products from "../models/ProductModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req,res)=>{
    try {
        let response;
        if(req.role === "Admin"){
            response = await Product.findAll({
                attributes:['uuid','name','price'],
                include : [{
                    model :User,
                    attributes:['name','email']
                }]
            })
        }else{ // user hanya bisa melihat barang yang dia inputkan sendiri
            response = await Product.findAll({
                attributes:['uuid','name','price'],
                where:{
                    userId : req.userId
                },
                include:[{
                    model:User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response)
    } catch (error) {
res.status(500).json({msg: error.message})
    }
}
export const getProductById = async(req,res)=>{
    try {
const product = await Product.findOne({
    where :{
        uuid: req.params.id
    }
    });
        if(!product) return res.status(404).json({msg:"Data Tidak ditemukan"})
        let response;
        if(req.role === "Admin"){
            response = await Product.findOne({
                attributes:['uuid','name','price'],
                where :{
                    id: product.id
                },
                include : [{
                    model :User,
                    attributes:['name','email']
                }]
            })
        }else{ // user hanya bisa melihat barang yang dia inputkan sendiri
            response = await Product.findOne({
                attributes:['uuid','name','price'],
                where : {
                    [Op.and]:[{id: product.id},{userId : req.userId}]
                },
                include : [{
                    model :User,
                    attributes:['name','email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
res.status(500).json({msg: error.message})
    }
}
export const createProduct = async(req,res)=>{
    const {name,price} = req.body;
    try {
        await Product.create({
            name:name,
            price:price,
            userId:req.userId // userId diambila dari middleware
        });
        res.status(201).json({msg: "product created succesfuly"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
    
}
export const updateProduct = async(req,res)=>{
    try {
        const product = await Product.findOne({
            where :{
                uuid: req.params.id
            }
            });
                if(!product) return res.status(404).json({msg:"Data Tidak ditemukan"})
                const {name,price} = req.body;
                if(req.role === "Admin"){
                    await Product.update({name,price},{
                        where:{
                            id: product.id
                        }
                    })
                }else{ // user hanya bisa melihat barang yang dia inputkan sendiri
                    if(req.userId !== product.userId) return res.status(403).json({msg:"Akses terlaranag"})
                    await Product.update({name,price},{
                        where : {
                            [Op.and]:[{id: product.id},{userId : req.userId}]
                        }
                    })
                }
                res.status(200).json({msg:"Product Updated Succesfuly"})
            } catch (error) {
        res.status(500).json({msg: error.message})
            }
}
export const deleteProduct = async (req,res)=>{
    try {
        const product = await Product.findOne({
            where :{
                uuid: req.params.id
            }
            });
                if(!product) return res.status(404).json({msg:"Data Tidak ditemukan"})
                const {name,price} = req.body;
                if(req.role === "Admin"){
                    await Product.destroy({
                        where:{
                            id: product.id
                        }
                    })
                }else{ // user hanya bisa melihat barang yang dia inputkan sendiri
                    if(req.userId !== product.userId) return res.status(403).json({msg:"Akses terlaranag"})
                    await Product.destroy({
                        where : {
                            [Op.and]:[{id: product.id},{userId : req.userId}]
                        }
                    })
                }
                res.status(200).json({msg:"Product Deleted Succesfuly"})
            } catch (error) {
        res.status(500).json({msg: error.message})
    }
}