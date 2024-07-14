/*const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'voting'
});

connection.connect();

// 插入候选人数据
const candidates = ["Alice", "Bob", "Charlie"];
candidates.forEach(candidate => {
    connection.query('INSERT INTO Candidates (name) VALUES (?)', [candidate], (error, results) => {
        if (error) throw error;
        console.log(`Inserted candidate: ${candidate}`);
    });
});

// 获取所有候选人的 ID
connection.query('SELECT id, name FROM Candidates', (error, results) => {
    if (error) throw error;

    const candidateMap = results.reduce((map, candidate) => {
        map[candidate.name] = candidate.id;
        return map;
    }, {});

    // 插入选票数据
    ballots.forEach((ballot, ballotIndex) => {
        ballot.rank.forEach((candidate, rank) => {
            const candidateId = candidateMap[candidate];
            connection.query('INSERT INTO Ballots (ballot_id, candidate_id, rank) VALUES (?, ?, ?)', [ballotIndex + 1, candidateId, rank + 1], (error, results) => {
                if (error) throw error;
                console.log(`Inserted ballot: ${ballotIndex + 1}, candidate: ${candidate}, rank: ${rank + 1}`);
            });
        });
    });
});

connection.end();*/
