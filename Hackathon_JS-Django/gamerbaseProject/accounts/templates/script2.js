
fetch('http://127.0.0.1:8000/api/mylistgames/')
    .then(response => response.json())
    .then(data => {
        // Loop through the array and append gameId to the HTML body
        data.forEach(item => {
            const gameId = item.gameId;
            findingGameInfo(gameId)

        });
    })
    .catch(error => console.log(error));

async function findingGameInfo(gameID) {
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameID}?&key=2d4f966e24d14bd6bab835eb5a72b62c`);

        const gameResults = await response.json();
        const gameIdElement = document.createElement('p');
        gameIdElement.textContent = gameResults;
        document.body.appendChild(gameIdElement);
    } catch(error) {
        console.log("ERROR", error);
    }
}