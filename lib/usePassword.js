import bcrypt from "bcryptjs"

/*Needs bettter error handling, used to hash pwds
before storing in db*/

function hashPwdSync(pwd) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pwd, salt);
}

async function hashPwdAsync(pwd) {
    const hash = bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(pwd, salt, function (err, hash) {
                        //Do whatever with the hash here, not necessarily return
                        return hash;
                    });
                }); 
}

function comparePwd(pwd, hash) {
    return bcrypt.compareSync(pwd, hash);  //If true, they're the same
}

async function comparePwdAsync(pwd, hash) {
    bcrypt.compare(pwd, hash).then(res => res)
    .catch(err => {throw "Error while comparing pwd and hash",err});
}