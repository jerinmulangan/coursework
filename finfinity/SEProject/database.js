const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const corsOptions = {
    origin: 'http://localhost:61096', 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'finfinity',
    database: 'FinFinity'
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.query('INSERT INTO Users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);
        connection.release();
        res.send('User registered successfully!');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM Users WHERE Email = ?', [email]);
        if (users.length === 0) {
            connection.release();
            res.status(404).json({ success: false, message: 'Email not found' });
            return;
        }
        await connection.query('UPDATE Users SET Password = ? WHERE Email = ?', [newPassword, email]);
        connection.release();
        res.json({ success: true, message: 'Password updated successfully!' });
    } catch (error) {
        connection.release();
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Error updating password' });
    }
});


app.get('/spendings', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [spendings] = await connection.query('SELECT * FROM NewSpendings');
        connection.release();
        res.json(spendings);
    } catch (error) {
        console.error('Error fetching spendings:', error);
        res.status(500).send('Error fetching spendings');
    }
});

app.post('/submit-spending', async (req, res) => {
    try {
        const { amount, category, spendingDate } = req.body;
        console.log('Amount:', amount);
        console.log('Category:', category);
        console.log('Spending Date:', spendingDate);

        if (!amount || !category || !spendingDate) {
            throw new Error('Missing required fields');
        }

        const connection = await pool.getConnection();
        await connection.query('INSERT INTO NewSpendings (amount, category, spendingDate) VALUES (?, ?, ?)', [amount, category, spendingDate]);
        connection.release();
        res.status(200).send('Spending submitted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to submit spending: ' + error.message);
    }
});

app.delete('/delete-spending/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query('DELETE FROM NewSpendings WHERE id = ?', [id]);
        connection.release();
        if (result.affectedRows === 0) {
            res.status(404).send('No such spending found');
        } else {
            res.status(200).send('Spending deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting spending:', error);
        res.status(500).send('Server error');
    }
});


app.put('/update-spending/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, category, spendingDate } = req.body;

    if (!amount || !category || !spendingDate) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query(
            'UPDATE NewSpendings SET amount = ?, category = ?, spendingDate = ? WHERE id = ?',
            [amount, category, new Date(spendingDate), id]
        );
        connection.release();

        if (results.affectedRows === 0) {
            return res.status(404).send('Spending not found');
        }

        res.send('Spending updated successfully');
    } catch (error) {
        console.error('Error updating spending:', error);
        res.status(500).send('Failed to update spending: ' + error.message);
    }
});

app.post('/submit-goal', async (req, res) => {
    try {
        const { title, description, targetAmount, deadline, priority } = req.body;

        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Target Amount:', targetAmount);
        console.log('Deadline:', deadline);
        console.log('Priority:', priority);

        if (!title || !description || !targetAmount || !deadline || !priority) {
            throw new Error('Missing required fields');
        }

        const connection = await pool.getConnection();
        await connection.query('INSERT INTO FinancialGoals (title, description, targetAmount, deadline, priority) VALUES (?, ?, ?, ?, ?)', [title, description, targetAmount, deadline, priority]);
        connection.release();
        res.status(200).send('Financial goal submitted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to submit financial goal: ' + error.message);
    }
});


const convertDate = (inputFormat) => {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
}




app.get('/financial-goals', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM FinancialGoals');
        connection.release();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching financial goals:', error);
        res.status(500).send('Failed to fetch financial goals: ' + error.message);
    }

    
      
});




app.delete('/financial-goals/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query('DELETE FROM FinancialGoals WHERE id = ?', [id]);
        connection.release();
        if (result.affectedRows === 0) {
            res.status(404).send('Goal not found');
        } else {
            res.status(200).send('Goal deleted successfully');
        }
    } catch (error) {
        connection?.release();
        console.error('Error:', error);
        res.status(500).send('Failed to delete goal: ' + error.message);
    }
});

app.put('/financial-goals/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, targetAmount, deadline, priority } = req.body;
    const formattedDeadline = convertDate(deadline);
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query(
            'UPDATE FinancialGoals SET title = ?, description = ?, targetAmount = ?, deadline = ?, priority = ? WHERE id = ?',
            [title, description, targetAmount, formattedDeadline, priority, id]
        );
        connection.release();

        if (results.affectedRows === 0) {
            return res.status(404).send('Goal not found');
        }
        res.status(200).send('Goal updated successfully');
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).send('Failed to update goal: ' + error.message);
    }
});









app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM Users WHERE Email = ? AND Password = ?', [email, password]);
        connection.release();
        if (users.length > 0) {
            res.send('Logged in successfully!');
        } else {
            // Check if the email exists at all
            const [emailExists] = await connection.query('SELECT * FROM Users WHERE Email = ?', [email]);
            if (emailExists.length > 0) {
                res.status(401).send('Incorrect password');
            } else {
                res.status(404).send('Email account does not exist');
            }
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

// Endpoint to fetch all budget categories
app.get('/budget-categories', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM Budget');
        connection.release();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching budget categories:', error);
        res.status(500).send('Failed to fetch budget categories: ' + error.message);
    }
});

// Endpoint to delete a budget category
app.delete('/budget/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query('DELETE FROM Budget WHERE id = ?', [id]);
        connection.release();
        if (result.affectedRows === 0) {
            res.status(404).send('Category not found');
        } else {
            res.status(200).send('Category deleted successfully');
        }
    } catch (error) {
        connection?.release();
        console.error('Error:', error);
        res.status(500).send('Failed to delete category: ' + error.message);
    }
});

// Endpoint to update the spent and remaining amounts in the Budget table based on spending data
app.put('/update-budget', async (req, res) => {
    try {
        // Retrieve spending data from the NewSpendings table
        const connection = await pool.getConnection();
        const [spendingRows] = await connection.query('SELECT category, SUM(amount) AS totalSpent FROM NewSpendings GROUP BY category');
        
        // Update the Budget table for each spending category
        for (const spendingRow of spendingRows) {
            const { category, totalSpent } = spendingRow;
            const [budgetRow] = await connection.query('SELECT budget_amount, spent_amount FROM Budget WHERE category = ?', [category]);
            
            // Calculate remaining amount
            const { budget_amount, spent_amount } = budgetRow[0];
            const remaining_amount = budget_amount - totalSpent;
            
            // Update spent_amount and remaining_amount in the Budget table
            await connection.query('UPDATE Budget SET spent_amount = ?, remaining_amount = ? WHERE category = ?', [totalSpent, remaining_amount, category]);
        }
        
        connection.release();

        res.status(200).send('Budget updated successfully');
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).send('Failed to update budget: ' + error.message);
    }
});

// Endpoint to add a new budget category
app.post('/budget', async (req, res) => {
    const { category, budgetAmount } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.query('INSERT INTO Budget (category, budget_amount, spent_amount, remaining_amount) VALUES (?, ?, 0, ?)', [category, budgetAmount, budgetAmount]);
        connection.release();
        res.status(201).send('Budget category added successfully');
    } catch (error) {
        console.error('Error adding budget category:', error);
        res.status(500).send('Failed to add budget category: ' + error.message);
    }
});

// Endpoint to update a budget category
app.put('/budget/:id', async (req, res) => {
    const { id } = req.params;
    const { name, budgetAmount } = req.body;
    try {
        const connection = await pool.getConnection();
        const [budgetRow] = await connection.query('SELECT category, budget_amount FROM Budget WHERE id = ?', [id]);
        const oldCategory = budgetRow[0].category;
        const oldBudgetAmount = budgetRow[0].budget_amount;
        await connection.query('UPDATE Budget SET category = ?, budget_amount = ? WHERE id = ?', [name, budgetAmount, id]);
        
        // Retrieve spending data from the NewSpendings table
        const [spendingRows] = await connection.query('SELECT category, SUM(amount) AS totalSpent FROM NewSpendings WHERE category = ? GROUP BY category', [oldCategory]);
        
        // Update the spent and remaining amounts in the Budget table for the old category
        if (spendingRows.length > 0) {
            const totalSpent = spendingRows[0].totalSpent;
            const remaining_amount = budgetAmount - totalSpent;
            await connection.query('UPDATE Budget SET spent_amount = ?, remaining_amount = ? WHERE category = ?', [totalSpent, remaining_amount, oldCategory]);
        } else {
            await connection.query('UPDATE Budget SET spent_amount = ?, remaining_amount = ? WHERE category = ?', [0, budgetAmount, oldCategory]);
        }
        
        // Update the spending amounts for the new category
        await connection.query('UPDATE NewSpendings SET category = ? WHERE category = ?', [name, oldCategory]);
        
        connection.release();
        res.status(200).send('Budget category updated successfully');
    } catch (error) {
        console.error('Error updating budget category:', error);
        res.status(500).send('Failed to update budget category: ' + error.message);
    }
});

// Set this to a different port from the frontend
const port = 4024;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
