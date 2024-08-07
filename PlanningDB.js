/* const sql = require("mssql/msnodesqlv8");
var config ={
    server : "DESKTOP-SQ9T17J\\SQLEXPRESS",
    database : "YAZAKI",
    driver : "msnodesqlv8",
    user : "vsel",
    password : "vsel1234",
    options : {
        trustedConnection : true
    }
}

sql.connect(config,function(err){
    if(err)console.log(err);admin
    var request = new sql.Request();
    request.query("Select * from planning", function(err,records){
        if(err)console.log(err);
        else console.log(records);
        return records;
    })
}) */


const express = require('express');
const app1 = express();
const cors = require('cors');


app1.use(cors())
app1.use(express.json());

const port = 8000;


app1.listen(port, ()=>{
    console.log(`GTI 2 is listening at ${port}`)
})



/*     
const sql = require("mssql/msnodesqlv8");
const readlineSync = require('readline-sync');  
const { selectedFile,selectedFolder,selectedMachine } = require('./Processnames');

    var config ={
        server : "DESKTOP-SQ9T17J\\SQLEXPRESS",
        database : "YAZAKI",
        driver : "msnodesqlv8",
        user : "vsel",
        password : "vsel1234",
        options : {
            trustedConnection : true
        }
    }

    sql.connect(config,function(err){
        if(err)console.log(err);
        else {

            console.log("Connected to database. ");            
            console.log("Line Name: "); 
            var lineName = readlineSync.question();
            console.log("System: ");
            var system = readlineSync.question();
            console.log("Process: ");
            var process = readlineSync.question();
            console.log("Shift: ");
            var shift = readlineSync.question();
            console.log("ID: ");
            var id = readlineSync.question();

            var lineName = selectedFolder;
            var system = selectedMachine;
            var process = selectedFile;
            var id = 350;

            var request = new sql.Request();
            request.input("Date", sql.DateTime, Date);
            request.input("LineName", sql.NVarChar, lineName);
            request.input("System", sql.NVarChar, system);
            request.input("Process", sql.NVarChar, process);
            request.input("Shift", sql.NVarChar, shift);
            request.input("ID", sql.Int, id);
            request.query("INSERT INTO planning (ID, LineName, System, Process, Shift) VALUES (@ID, @LineName, @System, @Process, @Shift)", function(err, result){
                if(err)console.log(err);
                else console.log("Data inserted successfully!");
                alert("Data Updated ");
            }); 

          request.query(`UPDATE planning SET LineName = @LineName, System = @System, Process = @Process, Shift = @Shift WHERE ID = @ID`, (err, result) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log('Data updated successfully!');
                }
              });
        }
    });  

 */
    