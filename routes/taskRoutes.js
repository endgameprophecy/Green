
const express = require("express");
var StellarSdk = require("stellar-sdk");
const router = express.Router();

const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/", auth, (req, res) => {
    const {strAdd, lat, lng, value, description, userId, postedSecret, name} = req.body;
    
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; 
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = month + "/" + day + "/" + year;

    var newTask = new Task({
        address: strAdd,
        latitude: lat,
        longitude: lng,
        description: description,
        value: value,
        postedBy: userId,
        postedName: name,
        date: newdate,
        postedSecret: postedSecret,
    });
    
    newTask.save().then(task => {
        console.log('Registering...');
        res.json({
            task
        });
    }).catch(err => {
        console.log('err', err);
        res.status(400).json({msg: "Please enter all fields"});
    });
});

router.get('/', auth, (req, res) => {
    Task.find({}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Result");
            return res.json(result);
        }
    });
});

router.get("/:userId", auth, (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({msg: "User does not exist"});
    }
    const { type } = req.query;
    if(type === "Employer"){
        Task.find({ postedBy: req.params.userId }, function (err, tasks) {
            if (err) console.log(err);
            if (tasks == null) {
                return res.status(404).json({msg: "User does not exist"});
            }
            return res.json(tasks);
        });
    }else{
        Task.find({ claimedBy: req.params.userId }, function (err, tasks) {
            if (err) console.log(err);
            if (tasks == null) {
                return res.status(404).json({msg: "User does not exist"});
            }
            return res.json(tasks);
        });
    }
});

router.put('/:taskAdd', (req, res) => {
    const { status, claimedBy, claimedName, claimedPublic, postedSecret, value, address } = req.body;

    console.log("Address", address);
    let tmp = address;
    console.log("Claimed public", claimedPublic);
    console.log("Posted secret", postedSecret);
    if (status === "Confirmed"){
        var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
        var sourceKeys = StellarSdk.Keypair.fromSecret(postedSecret);
        var destinationId = claimedPublic;
        // Transaction will hold a built transaction we can resubmit if the result is unknown.
        var transaction;

        // First, check to make sure that the destination account exists.
        // You could skip this, but if the account does not exist, you will be charged
        // the transaction fee when the transaction fails.
        server
            .loadAccount(destinationId)
            // If the account is not found, surface a nicer error message for logging.
            .catch(function (error) {
                if (error instanceof StellarSdk.NotFoundError) {
                throw new Error("The destination account does not exist!");
                } else return error;
            })
            // If there was no error, load up-to-date information on your account.
            .then(function () {
                return server.loadAccount(sourceKeys.publicKey());
            })
            .then(function (sourceAccount) {
                // Start building the transaction.
                transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
                })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: destinationId,
                        // Because Stellar allows transaction in many currencies, you must
                        // specify the asset type. The special "native" asset represents Lumens.
                        asset: StellarSdk.Asset.native(),
                        amount: value + "",
                    }),
                )
                // A memo allows you to add your own metadata to a transaction. It's
                // optional and does not affect how Stellar treats the transaction.
                .addMemo(StellarSdk.Memo.text("Test Transaction"))
                // Wait a maximum of three minutes for the transaction
                .setTimeout(180)
                .build();
                // Sign the transaction to prove you are actually the person sending it.
                transaction.sign(sourceKeys);
                // And finally, send it off to Stellar!
                return server.submitTransaction(transaction);
            })
            .then(function (result) {
                console.log("Success! Results:", result);
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
                // If the result is unknown (no response body, timeout etc.) we simply resubmit
                // already built transaction:
                // server.submitTransaction(transaction);
            });
    }
    Task.findOneAndUpdate({address: tmp}, {
        status: status,
        claimedBy: claimedBy,
        claimedName: claimedName,
        claimedPublic: claimedPublic,
        postedSecret: postedSecret,
    }, {useFindAndModify: false}, (err) => {
        console.log(err, "Error Hello");
    } )
    
});

router.delete('/', (req, res) => {
    const { address } = req.body;

    Task.deleteOne({ address: address }, function (err) {
        if (err) console.log(err);
    }); 
});



module.exports = router;