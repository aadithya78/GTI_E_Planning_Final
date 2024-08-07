const { CONFIG_DATA, excelReader } = require('../lib/excelReader');
const ipaddr = CONFIG_DATA[10]['__EMPTY_6']+',1433';
const sql = require("mssql/msnodesqlv8");
var config ={
    server : ipaddr,
    database : "ePlanning",
    driver : "msnodesqlv8",
    user : "phoeneix",
    password : "ppa12345",
}

/*sql.connect(config,function(err){
    if(err)console.log(err);admin
    var request = new sql.Request();
    request.query("Select * from planning", function(err,records){
        if(err)console.log(err);
        else console.log(records);
        return records;
    })
})*/

console.log(ipaddr);
const express = require('express');
const app1 = express();
const cors = require('cors');
const os = require('os');
app1.use(cors())
app1.use(express.json());
const port = 8000;
app1.post('/Planning', (req, res) => {
    const { options } = req.body;
    sql.connect(config, function(err) {
        if (err) console.log(err);
        else {
            var request = new sql.Request();
            request.input("Date", sql.Date, options.Date);
            request.input("LineName", sql.NVarChar, options.LineName ? options.LineName : null);
            request.input("System", sql.NVarChar, options.System ? options.System : null);
            request.input("Process", sql.NVarChar, options.Process ? options.Process : null);
            request.input("Shift", sql.NVarChar, options.Shift ? options.Shift : null);

            request.query("INSERT INTO planning (Date,LineName, System, Process, Shift) VALUES (@Date, @LineName, @System, @Process, @Shift)", function(err, result){
                if(err)console.log(err);
                else {
                    console.log("Data inserted successfully!");
                }
          
            }); 
        }
    });
}); 

app1.post('/Planning/updateActualField', (req, res) => {
  const { ID, Actual } = req.body;
  sql.connect(config, function(err) {
      if (err) {
          console.error('SQL connection error:', err);
          res.status(500).send('SQL connection error');
          return;
      }

      var request = new sql.Request();
      request.input("ID", sql.Int, ID);
      request.input("Actual", sql.Int, Actual);

      request.query(
          "UPDATE planning SET Actual = @Actual WHERE ID = @ID",
          function(err, result) {
              if (err) {
                  console.error('SQL query error:', err);
                  res.status(500).send('SQL query error');
              } else {
                  console.log("Actual field updated successfully!");
                  res.send({ message: "Actual field updated successfully!" });
              }
          }
      );
  });
});


app1.get('/Planning', (req, res) => {
    const selectedDate = req.query.date;
    const selectedLineName = req.query.lineName;
    const selectedShift = req.query.shift;

    const query = `SELECT ID, Date, LineName, Process, Seq, Target, Remark FROM planning WHERE 
    Date = @date
    AND LineName = @lineName 
    AND Shift = @shift`;

    sql.connect(config, err => {
        if (err) {
            console.error('Database connection failed:', err);
            res.status(500).send('Database connection failed');
            return;
        }
        const request = new sql.Request();
        request.input('date', sql.Date, selectedDate);
        request.input('lineName', sql.NVarChar, selectedLineName);
        request.input('shift', sql.NVarChar, selectedShift);
        request.query(query, (err, result) => {
            if (err) {
                console.error('Query execution failed:', err);
                res.status(500).send('Query execution failed');
                return;
            }
            res.json(result.recordset);
        });
    });
});

app1.get('/Planning/indexTable', (req, res) => {
  const selectedDate = new Date;
  const computerName = os.hostname();
  const query = `SELECT ID, Date, LineName, System, Process, Shift, Seq, Target, Remark 
                  FROM planning 
                  WHERE Date = @date AND System = @system`;

  sql.connect(config, err => {
    if (err) {
      console.error('Database connection failed:', err);
      res.status(500).send('Database connection failed');
      return;
    }
    const request = new sql.Request();
    request.input('date', sql.Date, selectedDate);
    request.input('system', sql.NVarChar, computerName);
    request.query(query, (err, result) => {
      if (err) {
        console.error('Query execution failed:', err);
        res.status(500).send('Query execution failed');
        return;
      }
      res.json(result.recordset);
    });
  });
});

app1.get('/Planning/TargetByID', (req, res) => {
  const id = req.query.id;
  const query = 'SELECT Target FROM planning WHERE ID = @id';
  sql.connect(config, err => {
      if (err) {
          console.error('Database connection failed:', err);
          res.status(500).send('Database connection failed');
          return;
      }
      const request = new sql.Request();
      request.input('id', sql.Int, id);
      request.query(query, (err, result) => {
          if (err) {
              console.error('Query execution failed:', err);
              res.status(500).send('Query execution failed');
              return;
          }
          res.json(result.recordset);
      });
  });
});

app1.delete('/Planning/Delete/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM planning WHERE ID = @id`;
  
    sql.connect(config, (err) => {
      if (err) {
        console.error('Database connection failed:', err);
        res.status(500).send({ success: false, error: 'Database connection failed' });
        return;
      } 
      const request = new sql.Request();
      request.input('id', sql.Int, id);
      request.query(query, (err, result) => {
        if (err) {
          console.error('Query execution failed:', err);
          res.status(500).send({ success: false, error: 'Query execution failed' });
          return;
        }
  
        res.send({ success: true });
      });
    });
  });

app1.patch('/Planning/patchData/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    const query = `UPDATE Planning SET ${Object.keys(updates).map(key => `${key} = '${updates[key]}'`).join(', ')} WHERE ID = ${id}`;
    sql.connect(config, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error connecting to database' });
      } else {
        const request = new sql.Request();
        request.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: 'Error executing query' });
          } else {
            res.json({ message: 'Updated successfully' });
          }
        });
      }
    });
  });

app1.listen(port, ()=>{
    console.log(`GTI 2 is listening at ${port}`)
})

/*     
const sql = require("mssql/msnodesqlv8");
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
    