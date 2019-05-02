const bcrypt = require('bcryptjs');

module.exports = {
	getUsers: (req, res) => {
		const db = req.app.get('db');
		db.getAllUsers().then((data) => {
			res.status(200).send(data)
		})
  },
  register: async (req, res) => {
    const db = req.app.get('db');
    const {email, firstname, lastname, username, password} = req.body;
    const {session} = req;
    let emailTaken = await db.checkEmail({email});
    emailTaken = +emailTaken[0].count
    if(emailTaken !== 0){
      return res.sendStatus(409) // conflict
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const user_id = await db.registerUser({
      email,
      firstname,
      lastname,
      username,
      hash
    })
    session.user = {
      username,
      name,
      login_id: user_id[0].balance_id
    }
    res.sendStatus(200);
  },
  login: async (req, res) => {
    const db = req.app.get('db');
    const {session} = req;
    const {loginUsername : username} = req.body;
    try {
      let user = await db.login({username});
      session.user = user[0];
      const authenticated = bcrypt.compareSync(req.body.loginPassword, user[0].password);
      if (authenticated) {
        res.status(200).send({authenticated, user_id: user[0].login_id})
      } else {
        throw new Error(401);
      }
    } catch (err) {
      res.sendStatus(401);
    }
  },
  getDetails: async (req, res) => {
    const db = req.app.get('db');
    const {session} = req;
    const {login_id : id} = session.user;
    try {
      const data = await db.getUserDetails({id});
      res.status(200).send(data[0]);
    } catch (err) {
      res.sendStatus(500) // internal server error
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  }
}