let db = require('../db/index')

exports.all = (req, res) => {        //获取new_sample表全部数据
    var sql = 'select * from tagged_sample'
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.get = (req, res) => {        //通过id查询数据
    var sql = 'select * from tagged_sample where tagged_sample_id = ?'    //？用于占位
    db.query(sql, [req.query.tagged_sample_id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.del = (req, res) => {        //通过id删除数据
    var sql = 'delete from tagged_sample where tagged_sample_id = ?'
    db.query(sql, [req.query.tagged_sample_id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        if(data.affectedRows > 0) {
            res.send({
              status: 200,
              message: '删除成功'
            })
        }else{
            res.send({
              status: 202,
              message: '删除失败'
            })
        }
    })
}

exports.add = (req, res) => {        //向info表添加数据
    var sql = 'insert into tagged_sample (parent_id,create_time,prompt,response,ranking) values (?,CURRENT_TIMESTAMP,?,?,?)'
    db.query(sql, [req.query.parent_id,req.query.prompt,req.query.response,req.query.ranking], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        if(data.affectedRows > 0) {
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

exports.update = (req, res) => {        //通过id更新数据
    var sql = 'update tagged_sample set tagged_sample_id = ?, parent_id = ?, ranking = ?, prompt = ?,response = ? where tagged_sample_id = ?'
    db.query(sql, [req.query.new_sample_id, req.query.parent_id, req.query.ranking, req.query.prompt,req.query.response], (err, data) => {
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

exports.download = (req, res) => {        //获取new_sample表全部数据
    var sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('tagged_sample_id', tagged_sample_id, 'parent_id', parent_id, 'prompt', prompt,'response',response,'create_time',create_time))FROM tagged_sample;"
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.min = (req, res) => {        //获取new_sample表全部数据
    var sql = 'SELECT MIN(parent_id) FROM new_sample where parent_id > 0'
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
