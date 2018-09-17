var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () 
{
    var root=router.route('/');
    root.get(function (req, res) 
    {
        conn.connect().then(function () 
        {
            var sqlQuery = "SELECT * FROM Products";
            var req = new sql.Request(conn);
            req.query(sqlQuery).then(function (recordset) 
            {
                res.json(recordset.recordset);
                conn.close();
            }).catch(function (err) 
            {
                conn.close();
                res.status(400).send("Error while retriveing data");
            });
        }).catch(function (err) 
        {
            conn.close();
            res.status(400).send("Error while inserting data");
        });
    });

    root.post((req,res)=>
    {
        conn.connect().then(()=>
        {
            var trans=new sql.Transaction(conn);
            trans.begin().then(()=>
            {
                var sqlReq=new sql.Request(trans);
                sqlReq.input("Name",sql.VarChar(50),req.body.Name);
                sqlReq.input("Price",sql.Decimal(18,2),req.body.Price);

                sqlReq.execute("Usp_InsertProduct").then(()=>
                {
                    trans.commit().then((recordset)=>
                    {
                            conn.close();
                            res.status(200).send(req.body);
                    });
                }).catch((err)=>
                {
                        conn.close();
                        res.status(400).send(err);
                });
            });

        });
    });

    router.route('/:id').put(function(req,res)
    {
        conn.connect().then(()=>
        {
            var trans=new sql.Transaction(conn);
            trans.begin().then(()=>
            {
                var prodId=req.params.id;
                console.log(prodId);
                var sqlReq =new sql.Request(trans);
                sqlReq.input("ProductId",sql.Int,prodId);
                sqlReq.input("ProductPrice",sql.Decimal(18,0),req.body.ProductPrice);

                sqlReq.execute("Usp_UpdateProduct").then(()=>
                {
                    trans.commit().then((recordset)=>
                    {
                        conn.close();
                        res.status(200).send(req.body);
                    }).catch((err)=>
                    {
                        conn.close();
                        res.status(400).send("Error while updating product");
                    });
                }).catch((err)=>
                {
                    conn.close();
                    res.status(400).send("Error while updating proudct");
                });
            }).catch((err)=>
            {
                conn.close();
                res.status(200).send("Error while updating product");
            });
        });
    });

    router.route("/:id").delete((req,res)=>
    {
        conn.connect().then(()=>
        {
            var trans=new sql.Transaction(conn);
            trans.begin().then(()=>
            {
                var sqlReq=new sql.Request(trans);
                sqlReq.input("ProductId",sql.Int,req.params.id);
                sqlReq.execute("usp_DeleteProduct").then((recordset)=>
                {

                    
                    trans.commit().then(()=>
                    {
                        conn.close();
                        
                        var resmsg="";
                        if(recordset.rowsAffected[0]>0)
                            resmsg="productId:"+req.params.id;
                        else
                            resmsg="No product found";
                        res.status(200).send(resmsg);

                      //  res.status(200).json("productId:"+req.params.id);
                    }).catch((err)=>{
                        conn.close();
                        res.status(400).send("Error while deleting product");
                    });
                }).catch((err)=>
                {
                    conn.close();
                    res.status(400).send("Error while deleting product");
                    
                });
            });
        });
    });

    return router;
};
module.exports = routes;

