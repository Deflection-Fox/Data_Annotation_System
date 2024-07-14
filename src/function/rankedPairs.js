export default function rankedPairs(candidates, ballots) {
    const candidateCount = candidates.length;
    let pairwisePreferences = Array.from({ length: candidateCount }, () => Array(candidateCount).fill(0));

    // Compute pairwise preferences
    ballots.forEach(ballot => {
        for (let i = 0; i < ballot.length; i++) {
            for (let j = i + 1; j < ballot.length; j++) {
                const preferred = candidates.indexOf(ballot[i]);
                const lessPreferred = candidates.indexOf(ballot[j]);
                pairwisePreferences[preferred][lessPreferred]++;
            }
        }
    });

    // Create pairs and sort by strength of victory
    let pairs = [];
    for (let i = 0; i < candidateCount; i++) {
        for (let j = 0; j < candidateCount; j++) {
            if (i !== j) {
                const strength = pairwisePreferences[i][j] - pairwisePreferences[j][i];
                if (strength > 0) {
                    pairs.push({ winner: i, loser: j, strength: strength });
                }
            }
        }
    }

    pairs.sort((a, b) => b.strength - a.strength);

    // Lock in pairs without creating cycles
    let lockedPairs = Array.from({ length: candidateCount }, () => Array(candidateCount).fill(false));
    function createsCycle(winner, loser, lockedPairs, visited = new Set()) {
        if (winner === loser) return true;
        if (visited.has(loser)) return false;
        visited.add(loser);
        for (let i = 0; i < candidateCount; i++) {
            if (lockedPairs[loser][i] && createsCycle(winner, i, lockedPairs, visited)) {
                return true;
            }
        }
        return false;
    }

    pairs.forEach(pair => {
        if (!createsCycle(pair.winner, pair.loser, lockedPairs)) {
            lockedPairs[pair.winner][pair.loser] = true;
        }
    });

    // Determine the ranking
    let ranking = [];
    let sources = Array.from({ length: candidateCount }, (_, i) => i);

    while (ranking.length < candidateCount) {
        let foundSource = false;
        for (let i = 0; i < sources.length; i++) {
            let candidate = sources[i];
            let isSource = true;

            for (let j = 0; j < candidateCount; j++) {
                if (lockedPairs[j][candidate]) {
                    isSource = false;
                    break;
                }
            }

            if (isSource) {
                ranking.push(candidate);
                sources.splice(i, 1);

                // Remove the candidate from lockedPairs
                for (let k = 0; k < candidateCount; k++) {
                    lockedPairs[candidate][k] = false;
                }
                
                foundSource = true;
                break;
            }
        }
        
        if (!foundSource) {
            console.log("Warning: Unable to determine source. Handling tie scenario.");
            let randomIndex = Math.floor(Math.random() * sources.length);
            ranking.push(sources[randomIndex]);
            sources.splice(randomIndex, 1);
        }
    }

    return ranking.map(index => candidates[index]);
}
