let db = require('../db/index')

exports.addballot = (req, res) => {        //通过id更新数据
    var sql = 'INSERT INTO ballot (user_id,ballot_id,parent_id,sample_id, ranking) VALUES (?, ?, ?,?,?)'
    db.query(sql, [req.query.user_id, req.query.ballot_id, req.query.parent_id, req.query.sample_id,req.query.ranking], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        if(data.changedRows > 0) {
          res.send({
            status: 200,
            message: 'success'
          })
        }else{
          res.send({
            status: 202,
            message: 'error'
          })
        }
    })
}

exports.maxballot = (req, res) => {        //获取new_sample表全部数据
    var sql = 'SELECT MAX(ballot_id) AS max_ballot_id FROM ballot;'
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}