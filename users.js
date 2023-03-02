
const { table } = require("console");
const express = require("express");
const sql = require("mysql");
const url = require("url");
const config = {
     password:"2003victor",
     user:"vic",
     host:"localhost",
     database:"clothline"
}

var conn = sql.createConnection(config);



const router = express.Router();

router.patch("/",(req,res)=>{
     conn = sql.createConnection(config);
     conn.connect((err)=>{
          if(err){
               console.log(err);
               return;
          };
     }); 
          const query = url.parse(req.url,true).query;

          var updateCustomer = `
              UPDATE customers 
              SET address="${query.address}"
              WHERE name="${query.name}"
          `;
               conn.query(updateCustomer,(error,result)=>{
                    if(error) throw error;
                    res.json(result);
                    //conn.end();
               });
});

router.delete("/:customerId",(req,res)=>{
     conn = sql.createConnection(config);
     var connection = conn.connect((err)=>{
         if(err) throw err;
     });
          const query = req.url.substring(req.url.lastIndexOf("/")+1,);
          var DeleteCustomers = `
                 DELETE FROM customers WHERE name="${query}";
          `;
          conn.query(DeleteCustomers,(error,result)=>{
                 if(error) throw error;
                res.json(result);
                //conn.end();
          });
          conn.end();
});

router.get("/",(req,res)=>{
     conn = sql.createConnection(config);
   var connection = conn.connect((err)=>{
     if(err) throw err;
});

     //if(err) throw err;
     const query = url.parse(req.url,true).query;
     var fetchCustomers = `
            SELECT * FROM customers;
     `;
     conn.query(fetchCustomers,(error,result)=>{
           res.json(result);
           //conn.end();
     });
});

router.get("/:customerName",(req,res)=>{
     conn = sql.createConnection(config);
     var connection = conn.connect((err)=>{
          if(err) throw err;
     });
       try{
       const query = req.url.substring(req.url.lastIndexOf("/")+1,);
       var fetchCustomers = `
              SELECT * FROM customers WHERE name="${query}";
       `;
       conn.query(fetchCustomers,(error,result)=>{
              if(error) throw error;
             res.json(result);
             //conn.end();
       });
     }catch(e){
          res.json("error");
          //conn.end();
     }
     
  });


router.post("/",async (req,res)=>{
     conn = sql.createConnection(config);
     var connection = conn.connect(async (err)=>{
          if(err){
               console.log(err);
               return;
          };
     }); 
          
          const tableExists = `SHOW TABLES LIKE 'customers'`;

          const createTable = `CREATE TABLE 
          customers (
               id INT AUTO_INCREMENT PRIMARY KEY,
               firstname VARCHAR(255),
               lastname VARCHAR(255),
               email VARCHAR(255) NOT NULL UNIQUE,
               password VARCHAR(255) NOT NULL,
               datejoined date,
               lastlogin date,
               orders INT DEFAULT 0,
               orderstatus INT DEFAULT 0
               )`;
          const query = url.parse(req.url,true).query;
          var addCustomer = `
              INSERT 
              INTO customers (firstname,lastname,email,password) 
              VALUES (
               '${query.firstname}',
              '${query.lastname}',
              '${query.email}',
              '${query.password}'
              )
          `;

          var checkCustomer = `SELECT * FROM customers 
                                WHERE email="${query.email}";
                                `;
          
          var dropTable = `DROP TABLE customers`;

           conn.query(tableExists,(error,result)=>{
              if(error) throw error;
               if(result.length === 0){
                     conn.query(createTable,(error,result)=>{
                        if(error) throw error;
                    });
               }
              conn.query(checkCustomer,(err,result)=>{
                    if(result.length === 0){
                         conn.query(addCustomer,(error,result)=>{
                              if(error) throw error;
                              res.json(result);
                              //conn.end();
                        });
                   }else{
                    res.json({
                      ERROR:"Customer Exists"
                    })
                    }
                    //conn.end();
               });
                  
                   
               
          });
});

module.exports = router;

