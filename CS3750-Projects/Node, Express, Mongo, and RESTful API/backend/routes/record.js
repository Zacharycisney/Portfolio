const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;



// Returns all users (except for their passwords) (GET)
recordRoutes.route("/record").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb("bankaccounts");

        const result = await db_connect.collection("records").find({}, { // goes throught the whole collection and returns every user
            projection: {
                // _id: 1, 
                // firstName: 1,
                // lastName: 1,
                // email: 1,
                // phone: 1,
                // password: 0,
                // role: 1,
                // saving: 1,
                // checking: 1

                password: 0
            }
        }).toArray();

        res.json(result);
    } catch (err) {
        throw err;
    }
});
/*
[GET] localhost:5000/record
*/


// Displays user (except for the password) using their email (GET)
recordRoutes.route("/record/:email").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let myquery = {email: req.params.email };

        const result = await db_connect.collection("records").findOne(myquery, { // matches the email then spits out the user data minus the password
            projection: {
                password: 0 // excludes password
            }
        });

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: "User not found"}); // runs if there is no matching email
        }

    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});
/*
[GET] localhost:5000/record/<email>
*/


// Finds if a user exists based on email and password (POST)
recordRoutes.route("/record/find").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        const user = await db_connect.collection("records").findOne({ // must have a matching email and password on the user profile
            email: req.body.email,
            password: req.body.password
        });

        if (user) {
            res.status(200).json({ user: "exists"}); // confirmation
        } else {
            res.status(400).json({ error: "User does not exist"}); // no matches
        }

    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
});
/*
[POST] localhost:5000/record/find
	{
        "email": "1919flamer@gmail.com",
        "password": "Glizzer123"
	}
*/


// Creates a new record (POST)
recordRoutes.route("/record/add").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        const existingUser = await db_connect.collection("records").findOne({ email: req.body.email }); // checks for existing user
        if (existingUser){
            return res.status(400).json({ error: "Email already exists"});
        }

        let myobj = { // instaniating a new user
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: "",
            saving: 0,
            checking: 0
        };

        const result = await db_connect.collection("records").insertOne(myobj); 
        res.json(result);
    } catch (err) {
        throw err;
    }
});
/*
[POST] localhost:5000/record/add
	{
        "_id": "666b8d9ade88fa924f71ce25",
        "firstName": "Franky",
        "lastName": "Hanky",
        "email": "1919flamer@gmail.com",
        "phone": "555-555-5555",
		"password": "Glizzer123",
        "role": "customer",
        "saving": 0,
        "checking": 0
    }
*/


// Updates a record role by utillizing a customer email for a specific user (POST)
recordRoutes.route("/update/role/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let myquery = { email: req.params.email };
        const user = await db_connect.collection("records").findOne(myquery);  // looks for user based on the email provided

        if (!user){
            return res.status(404).json({ error: "User not found" }); // user not found
        }

        const allowedRoles = ["customer", "manager", "administrator"]; // specifies the allowed roles
        if (!allowedRoles.includes(req.body.role)){ // checks if input is allowed
            return res.status(400).json({ error: "Invalid role" });
        }
        
        let newvalues = { // updating the role
            $set: {
                role: req.body.role,
            }
        }

        const result = await db_connect.collection("records").updateOne(myquery, newvalues); 

        console.log("1 document role updated");
        res.json(result);
    } catch (err){
        throw err;
    }
});
/*
[POST] localhost:5000/update/role/<email>
	{
        "role": "administrator"
    }
*/


// Deposit money by utillizing a customer email for a specific user (POST)
recordRoutes.route("/deposit/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let myquery = { email: req.params.email };
        const user = await db_connect.collection("records").findOne(myquery); // looks for a user based on the email provided

        if (!user){
            return res.status(404).json({ error: "User not found" }); // no matching emails
        } 



        let { accountType, amount } = req.body; // taking in raw json

        if (!['savings', 'checking'].includes(accountType)) { // specifying the permitted types of input
            return res.status(400).json({ error: "Invalid account type" }); 
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: "Invalid deposit amount" });
        }
        


        let newBalance = (user[accountType] || 0) + amount; // doing the math

        let updateQuery = { // updating
            $set: {
                [accountType]: newBalance
            }
        };

        const result = await db_connect.collection("records").updateOne(myquery, updateQuery);

        console.log("Account balance updated");
        res.json({ message: "Deposit successful", newBalance: newBalance });
    } catch (err){
        throw err;
    }
});
/*
[POST] localhost:5000/deposit/<email>
	{
        "accountType": "checking",
        "amount": 13
    }
*/


// Withdraw money by utillizing a customer email for a specific user (POST)
recordRoutes.route("/withdraw/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let myquery = { email: req.params.email }; 
        const user = await db_connect.collection("records").findOne(myquery); // finding user based on email

        if (!user){ 
            return res.status(404).json({ error: "User not found" });
        }



        let { accountType, amount } = req.body; // taking in raw json input
 
        if (!['savings', 'checking'].includes(accountType)) { // specifying permitted input
            return res.status(400).json({ error: "Invalid account type" });
        }

        if (typeof amount !== 'number' || amount <= 0) {  // limiting amounts to only positive numbers
            return res.status(400).json({ error: "Invalid withdrawal amount" });
        }
        


        let currentBalance = user[accountType] || 0; // setting temp balance

        if (amount > currentBalance) { // overdraw check
            return res.status(400).json({ error: "Insufficient funds" });
        }



        let newBalance = currentBalance - amount; // doing the math

        let updateQuery = { // setting the balance
            $set: {
                [accountType]: newBalance
            }
        };

        const result = await db_connect.collection("records").updateOne(myquery, updateQuery);

        console.log("Account balance updated");
        res.json({ message: "Withdraw successful", newBalance: newBalance });
    } catch (err){
        throw err;
    }
});
/*
[POST] localhost:5000/withdraw/<email>
	{
        "accountType": "checking",
        "amount": 4
    }
*/


// Transfer money by utillizing a customer email for a specific user (POST)
recordRoutes.route("/transfer/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let myquery = { email: req.params.email };
        const user = await db_connect.collection("records").findOne(myquery); // finding user based on email

        if (!user){
            return res.status(404).json({ error: "User not found" });
        }



        let { fromAccount, toAccount, amount } = req.body; // taking in raw json input

        if (!['savings', 'checking'].includes(fromAccount) || !['savings', 'checking'].includes(toAccount)) {  // restricitng the accounts that are permitted
            return res.status(400).json({ error: "Invalid account type" });
        }

        if (fromAccount === toAccount) { // making sure its not the same account
            return res.status(400).json({ error: "Cannot transfer to the same account type" });
        }

        if (typeof amount !== 'number' || amount <= 0) { // making sure that the requested withdraw amount is positive
            return res.status(400).json({ error: "Invalid withdrawal amount" });
        }
        


        let fromBalance = user[fromAccount] || 0; // setting temp FROM account balance

        if (amount > fromBalance) { // checking for an over draw
            return res.status(400).json({ error: "Insufficient funds" });
        }



        let newFromBalance = fromBalance - amount; // removing withdrawl amount
        let newToBalance = (user[toAccount] || 0) + amount; // setting temp TO account balance

        let updateQuery = { // setting changes
            $set: {
                [fromAccount]: newFromBalance,
                [toAccount]: newToBalance
            }
        };

        const result = await db_connect.collection("records").updateOne(myquery, updateQuery);

        console.log("Account balance updated");
        res.json({ message: "Transfer successful", newFromBalance: newFromBalance, newToBalance: newToBalance });
    } catch (err){
        throw err;
    }
});
/*
[POST] localhost:5000/transfer/<email>
	{
        "fromAccount": "checking",
        "toAccount": "savings",
        "amount": 6
    }
*/


// deletes a record
recordRoutes.route("/:id").delete(async(req, res) => {
    try{
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
    const result = db_connect.collection("records").deleteOne(myquery);
    console.log("1 document deleted");
    res.json(result);
} catch (err){
    throw err;
}
});

module.exports = recordRoutes;
