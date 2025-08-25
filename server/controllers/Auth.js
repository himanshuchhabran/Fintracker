const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.signup = async (req,res) => {
    try{    
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            });
        }
        //hashing the password
        const salt = await bcypt.genSalt(10);
        const passwordHash = await bcypt.hash(password,salt);

        const newUser = await pool.query(
            'Insert into users (email,password_hash) values($1,$2) RETURNING id,email', 
            [email,passwordHash]
        );

        res.status(201).json({
            success:true,
            message:"User created sucessfully",
            user: newUser.rows[0]
        });
    } catch(error){

        console.error('Registration error:', error);
    // Check for unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
    }
}

exports.login = async (req,res) => {
    try{
         const {email,password} = req.body;
         if(!email || !password){
            res.status(400).json({
                message:"Email and password are required"
            });
         }

         const userResult = await Pool.query('SELECT * FROM users where email = $1',[email]);

         const user = userResult.rows[0];

         if(!user){
            return res.status(401).json({ message: 'Invalid credentials.' });
         }

         // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const payload ={
            user:{
                id:user.id,
                email:user.email,
            }
        };

        const secret = process.env.JWT_SECRET;

        jwt.sign(
            payload,
            secret,
            {expiresIn:'1h'},
            (error,token) =>{
                if(error) throw err;
                res.json({token});
            }
        );

    } catch(error){
         console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });

    }
   

}