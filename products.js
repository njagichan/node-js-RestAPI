const express = require("express");
const { Query } = require("mongoose");
const sql = require("mysql");
const url = require("url");

const config = {
  password: "2003victor",
  user: "vic",
  host: "localhost",
  database: "clothline",
};

//localhost:5000/products/?name=Soccer Ball&maker=Adidas&price=4000&quantity=5&discount=6&size=3&imageurl=pic.jpg

const router = express.Router();

router.get("/:productId",(req,res)=>{
  conn = sql.createConnection(config);
  console.log("hey");
  conn.connect((err)=>{
       if(err) throw err;
  });
    try{
    const query = req.url.substring(req.url.lastIndexOf("/")+1,);
    var fetchProducts = `
           SELECT * FROM products WHERE id="${query}";
    `;
    conn.query(fetchProducts,(error,result)=>{
           if(error) throw error;
          res.json(result);
          //conn.end();
    });
  }catch(e){
       res.json("error");
       //conn.end();
  }
  
});


router.get("/uploads",(req,res)=>{
  res.json("did it");
})


router.delete("/:productId",(req,res)=>{
  conn = sql.createConnection(config);
  var connection = conn.connect((err)=>{
      if(err) throw err;
  });
       const query = req.url.substring(req.url.lastIndexOf("/")+1,);
       var DeleteProduct = `
              DELETE FROM products WHERE id="${query}";
       `;
       conn.query(DeleteProduct,(error,result)=>{
              if(error) throw error;
             res.json(result);
             //conn.end();
       });
       conn.end();
});


router.patch("/",(req,res)=>{
  conn = sql.createConnection(config);
  conn.connect((err)=>{
       if(err){
            console.log(err);
            return;
       };
  }); 
       const query = url.parse(req.url,true).query;

       var updateProduct = `
           UPDATE products
           SET quantity="${query.quantity}"
           WHERE id="${query.id}"
       `;
            conn.query(updateProduct,(error,result)=>{
                 if(error) throw error;
                 res.json(result);
                 //conn.end();
            });
});

router.get("/",(req,res)=>{
  conn = sql.createConnection(config);
var connection = conn.connect((err)=>{
  if(err) throw err;
});

  //if(err) throw err;
  const query = url.parse(req.url,true).query;
  var fetchCustomers =   `
         SELECT * FROM products;
  `;
  conn.query(fetchCustomers,(error,result)=>{
        res.json(result);
        //conn.end();
  });
});

router.post("/", async (req, res) => {
  conn = sql.createConnection(config);
  var connection = conn.connect(async (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  const tableExists = `SELECT EXISTS(
                 SELECT 1
                 FROM information_schema.tables
                 WHERE table_name = "products"
             )`;
  const checkTable = "SHOW TABLES LIKE 'products'";

  const createTable = `CREATE 
             TABLE 
             products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                maker VARCHAR(255),
                price INT,
                quantity INT,
                discount INT,
                size INT,
                imageurl VARCHAR(255)
                )`;
  const query = req.body;
  var addProduct = `
                 INSERT 
                 INTO products (name,maker,price,quantity,discount,size,imageurl) 
                 VALUES (
                 '${query.name}',
                 '${query.maker}',
                 '${query.price}',
                 '${query.quantity}',
                 '${query.discount}',
                 '${query.size}',
                 '${query.imageurl}'
                 )
             `;

  var checkProduct = `SELECT * FROM products
                                   WHERE name="${query.name}";
                                   `;

  var dropTable = `DROP TABLE products`;

  conn.query(checkTable, (error, resultx) => {
    if (error) throw error;
    //res.json(resultx);
    if (parseInt(resultx.length) === 0) {
      conn.query(createTable, (error, result) => {
       if (error) throw error;
       //res.json(resultx);
      });
   }
    conn.query(checkProduct, (err, result) => {
      if (result.length === 0 || result[0].length === 0) {
        conn.query(addProduct, (error, result) => {
          if (error) throw error;
          res.json(result);
          //conn.end();
        });
      } else {
        var quantity = parseInt(result[0].quantity)+parseInt(query.quantity);

        var addProductQuantity = `
                    UPDATE products 
                    SET quantity = ${quantity}
                    WHERE name = "${query.name}"
              
                        `;

        conn.query(addProductQuantity, (error, result) => {
          if (error) throw error;
          res.json({
            SUCCESS:"product quantity++" ,
          });
         
        });
        
      }
      //conn.end();
    });
  });
});
module.exports = router;
