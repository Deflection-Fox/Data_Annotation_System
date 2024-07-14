let db = require('../db/index')

exports.all = (req, res) => {        //获取new_sample表全部数据
    var sql = 'select * from new_sample'
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.show = (req, res) => {        
    var sql = 'SELECT * FROM new_sample WHERE parent_id = (SELECT MIN(parent_id) FROM new_sample where parent_id > 0)'
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.get = (req, res) => {        //通过id查询数据
    var sql = 'select * from new_sample where new_sample_id = ?'    //？用于占位
    db.query(sql, [req.query.new_sample_id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.del = (req, res) => {        //通过id删除数据
    var sql = 'delete from new_sample where new_sample_id = ?'
    db.query(sql, [req.query.new_sample_id], (err, data) => {
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
    var sql = 'insert into new_sample (parent_id,create_time,prompt,response) values (?,CURRENT_TIMESTAMP,?,?)'
    db.query(sql, [req.query.parent_id, req.query.prompt,req.query.response], (err, data) => {
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
    var sql = 'update new_sample set parent_id = ?, prompt = ?,response = ? where new_sample_id = ?'
    db.query(sql, [req.query.parent_id, req.query.prompt,req.query.response,req.query.new_sample_id], (err, data) => {
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
        res.send(data)
    })
}

exports.joinpair = (req, res) => {        //获取new_sample表全部数据
    var sql = `
SELECT 
    ns.new_sample_id, 
    ns.parent_id AS ns_parent_id, 
    ns.create_time, 
    ns.prompt, 
    ns.response, 
    ns.sort AS ns_sort,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'term_id', b.term_id,
            'user_id', b.user_id,
            'ballot_id', b.ballot_id,
            'parent_id', b.parent_id,
            'sample_id', b.sample_id,
            'ranking', b.ranking
        )
    ) AS ballots
FROM 
    new_sample ns
JOIN 
    ballot b ON ns.new_sample_id = b.sample_id
GROUP BY 
    ns.new_sample_id, 
    ns.parent_id, 
    ns.create_time, 
    ns.prompt, 
    ns.response, 
    ns.sort;
`
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.previous = (req, res) => {        //向info表添加数据
    var sql = `SELECT *
    FROM new_sample
    WHERE parent_id = (
        SELECT MAX(parent_id)
        FROM new_sample
        WHERE parent_id < ?
        AND parent_id != -1
    );
    `
    db.query(sql, [req.query.parent_id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.next = (req, res) => {        //向info表添加数据
    var sql = `SELECT *
    FROM new_sample
    WHERE parent_id = (
        SELECT MIN(parent_id)
        FROM new_sample
        WHERE parent_id > ?
        AND parent_id != -1
    );
    `
    db.query(sql, [req.query.parent_id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.tmp = (req, res) => {        //向info表添加数据
    var sql = `SELECT *
    FROM new_sample
    WHERE parent_id = (
        SELECT MAX(parent_id)
        FROM new_sample
        WHERE parent_id < 3
        AND parent_id != -1
    );
    `
    db.query(sql,(err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.updaterank = (req, res) => {        //通过id查询数据
    var sql = 'update new_sample set ranking = ? where new_sample_id = ?'    //？用于占位
    db.query(sql, [req.query.ranking,req.query.new_sample_id], (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.getsamplecnt = (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM new_sample';
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).send('错误：' + err.message);
        }
        res.send(data[0].count.toString());
    });
};

exports.getcorrectcnt = (req, res) => {
    const sql = `
        WITH RECURSIVE tree AS (
            SELECT new_sample_id, parent_id FROM new_sample WHERE parent_id = -1
            UNION ALL
            SELECT ns.new_sample_id, ns.parent_id
            FROM new_sample ns
            INNER JOIN tree t ON t.new_sample_id = ns.parent_id
        )
        SELECT COUNT(DISTINCT new_sample_id) AS tree_count FROM tree;
    `;
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).send('错误：' + err.message);
        }
        res.send(data[0].tree_count.toString());
    });
};

exports.gettreecnt = (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM new_sample where parent_id = -1';
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).send('错误：' + err.message);
        }
        res.send(data[0].count.toString());
    });
};

exports.getMaxTreeDepth = (req, res) => {
    const checkMaxDepthSql = `
        WITH RECURSIVE tree AS (
            SELECT new_sample_id, parent_id, 1 AS depth FROM new_sample WHERE parent_id = -1
            UNION ALL
            SELECT ns.new_sample_id, ns.parent_id, t.depth + 1
            FROM new_sample ns
            INNER JOIN tree t ON t.new_sample_id = ns.parent_id
        )
        SELECT MAX(depth) AS maxDepth FROM tree;
    `;
    db.query(checkMaxDepthSql, (err, depthData) => {
        if (err) {
            return res.status(500).send('错误：' + err.message);
        }

        const maxDepth = depthData[0].maxDepth;
        res.send(maxDepth.toString()); // 只返回数字
    });
};


exports.getMaxChildrenNum = (req, res) => {
    const checkMaxChildrenSql = `
        SELECT parent_id, COUNT(*) AS childrenCount
        FROM new_sample
        WHERE parent_id != -1
        GROUP BY parent_id
        ORDER BY childrenCount DESC
        LIMIT 1;
    `;
    db.query(checkMaxChildrenSql, (err, childrenData) => {
        if (err) {
            return res.send('错误：' + err.message);
        }

        let maxChildrenNum = 0;
        if (childrenData.length > 0) {
            maxChildrenNum = childrenData[0].childrenCount;
        }

        res.send(maxChildrenNum.toString());
    });
};

exports.maxid = (req, res) => {        //通过id查询数据
    var sql = 'SELECT MAX(new_sample_id) AS maxId FROM new_sample'    //？用于占位
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data[0].maxId.toString())
    })
}

exports.download = (req, res) => {        //获取new_sample表全部数据
    var sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('new_sample_id', new_sample_id, 'parent_id', parent_id, 'prompt', prompt,'response',response,'create_time',create_time,'ranking',ranking))FROM new_sample;"
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}

exports.tree = (req, res) => {        //获取new_sample表全部数据
    var sql = `WITH RECURSIVE tree AS (
        SELECT new_sample_id, parent_id, create_time, prompt, response, sort, ranking, 1 AS depth, new_sample_id AS root_id
        FROM new_sample
        WHERE parent_id = -1
        UNION ALL
        SELECT ns.new_sample_id, ns.parent_id, ns.create_time, ns.prompt, ns.response, ns.sort, ns.ranking, t.depth + 1 AS depth, t.root_id
        FROM new_sample ns
        INNER JOIN tree t ON t.new_sample_id = ns.parent_id
    )
    SELECT root_id AS tree_root_id, new_sample_id, parent_id, create_time, prompt, response, sort, ranking, depth
    FROM tree
    ORDER BY tree_root_id, new_sample_id;
    `
    db.query(sql, (err, data) => {
        if(err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}