const positions = ['TL', 'TM', 'TR', 'ML', 'MM', 'MR', 'BL', 'BM', 'BR']

const originalState = () => ({
    player1: {
        stones: ['TL', 'TM', 'TR'],
        stoneMoves: {
            0: [],
            1: [],
            2: []
        },
        movedAllStones: false,
        score: 0
    },
    player2: {
        stones: ['BL', 'BM', 'BR'],
        stoneMoves: {
            0: [],
            1: [],
            2: []
        },
        movedAllStones: false,
        score: 0
    },
    currentPlayer: 'player1',
    emptyTiles: ['ML', 'MM', 'MR'],
    clickedTile: '',
    preMoveStatus: false,
    turns: 0,
    gameOver: false
})

const store = {
    state: originalState(),
    getPlayerStones() {
        return {
            player1: this.state.player1.stones,
            player2: this.state.player2.stones
        }
    },
    getCurrentPlayer(player) {
        return this.state.currentPlayer === player ? true : false
    },
    getValidTiles() {
        const playerStonesObj = this.getPlayerStones()
        const playerStones = [
            ...playerStonesObj.player1,
            ...playerStonesObj.player2
        ]
        return positions.filter((item) => playerStones.indexOf(item) == -1)
    },
    updateEmptyTiles() {
        this.state.emptyTiles = this.getValidTiles()
    },
    /**
     * Check if clicked cell is an empty cell & premovephase, move stone to it
     * and update player stones and empty cells
     * @param {String} position position of clicked tile
     */
    checkMoves(position) {
        const { preMoveStatus, emptyTiles, clickedTile } = this.state

        if (preMoveStatus) {
            for (const cell of emptyTiles) {
                if (cell === position) {
                    this.updateStonePosition(clickedTile, position)
                }
            }
        }
    },
    /**
     * Return the current players score 
     * @returns {number[]} a number array. First number is player1 score & the scond is player2 score 
     */
    getPlayerScore() {
        const { player1, player2 } = this.state 
        return [player1.score, player2.score]
    },
    /**
     * Reset the gameboard leeping the scores
     */
    resetGame() {
        const [player1Score, player2Score] = this.getPlayerScore()
        const newState = originalState()
        newState.player1.score = player1Score
        newState.player2.score = player2Score
        this.state.player1 = newState.player1
        this.state.player2 = newState.player2
        this.state.emptyTiles = newState.emptyTiles
        this.state.turns = 0
        this.state.clickedTile = ''
        this.state.gameOver = false
    },
    /**
     * Increments turns and changes turns between players
     */
    advanceTurns() {
        const { currentPlayer } = this.state
        this.state.turns += 1
        this.state.clickedTile = ''
        this.state.preMoveStatus = false
        const gameWon = this.checkWinCondition()

        if (gameWon) {
            alert(`${currentPlayer} WON!!`)
            this.state.gameOver = true
            this.state[currentPlayer].score += 1
            this.resetGame()
            return
        } else {
            currentPlayer === 'player1'
                ? (this.state.currentPlayer = 'player2')
                : (this.state.currentPlayer = 'player1')
        }
    },
    checkWinCondition() {
        const { currentPlayer } = this.state

        const row1Condition =
            this.state[currentPlayer].stones.includes('TL') &&
            this.state[currentPlayer].stones.includes('TM') &&
            this.state[currentPlayer].stones.includes('TR')
        const row2Condition =
            this.state[currentPlayer].stones.includes('ML') &&
            this.state[currentPlayer].stones.includes('MM') &&
            this.state[currentPlayer].stones.includes('MR')
        const row3Condition =
            this.state[currentPlayer].stones.includes('BL') &&
            this.state[currentPlayer].stones.includes('BM') &&
            this.state[currentPlayer].stones.includes('BR')
        const col1Condition =
            this.state[currentPlayer].stones.includes('TL') &&
            this.state[currentPlayer].stones.includes('ML') &&
            this.state[currentPlayer].stones.includes('BL')
        const col2Condition =
            this.state[currentPlayer].stones.includes('TM') &&
            this.state[currentPlayer].stones.includes('MM') &&
            this.state[currentPlayer].stones.includes('BM')
        const col3Condition =
            this.state[currentPlayer].stones.includes('TR') &&
            this.state[currentPlayer].stones.includes('MR') &&
            this.state[currentPlayer].stones.includes('BR')

        return (
            this.state[currentPlayer].movedAllStones &&
            (row1Condition ||
                row2Condition ||
                row3Condition ||
                col1Condition ||
                col2Condition ||
                col3Condition)
        )
    },
    /**
     * Checks if all the stones of the current player have been moved from their original row tiles
     */
    checkPreWinCondition() {
        const { currentPlayer } = this.state
        const check = (index) => {
            if (currentPlayer === 'player1')
                return (
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'ML'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'MM'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'MR'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'BL'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'BM'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes('BR')
                )
            else
                return (
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'ML'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'MM'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'MR'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'TL'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes(
                        'TM'
                    ) ||
                    this.state[currentPlayer].stoneMoves[index].includes('TR')
                )
        }
        if (check(0) && check(1) && check(2))
            this.state[currentPlayer].movedAllStones = true
    },
    /**
     * Moves current player's stone from the given old tile to the new tile
     * @param {String} oldPosition Old tile position to move from
     * @param {String} newPosition New tile position to move to
     */
    updateStonePosition(oldPosition, newPosition) {
        const { currentPlayer } = this.state
        const oldPositionIndex = this.state[currentPlayer].stones.indexOf(
            oldPosition
        )

        if (!this.state[currentPlayer].movedAllStones) {
            this.state[currentPlayer].stoneMoves[oldPositionIndex].push(
                newPosition
            )
            this.checkPreWinCondition()
        }

        if (oldPositionIndex > -1) {
            this.state[currentPlayer].stones[oldPositionIndex] = newPosition
            this.updateEmptyTiles()
            this.advanceTurns()
        }
    }
}

Vue.component('Stone', {
    props: ['player'],
    data: function () {
        return {
            style: {
                width: '100%',
                height: '100%',
                textAlign: 'center'
            },
            currPlayerStyle: {
                fontWeight: 600
            }
        }
    },
    methods: {
        playerStone: function () {
            const currPlayer = store.state.currentPlayer
            const iconator = (type, icon) => {
                if (type === 'current') {
                    if (!store.state[currPlayer].movedAllStones) {
                        return `<span class="pe-stack pe-lg">
                            <i class="pe-7s-${icon} pe-5x pe-va pe-stack-2x" style="font-weight:600"></i>
                            <i class="pe-7s-lock pe-stack-1x" style="font-weight:600"></i>
                        </span>`
                    } else {
                        return `<i class="pe-7s-${icon} pe-5x pe-va" style="font-weight:600"></i>`
                    }
                }
                if (type === 'passive') {
                    if (!store.state[currPlayer].movedAllStones) {
                        return `<span class="pe-stack pe-lg">
                            <i class="pe-7s-${icon} pe-5x pe-va pe-stack-2x"></i>
                            <i class="pe-7s-lock pe-stack-1x"></i>
                        </span>`
                    } else {
                        return `<i class="pe-7s-${icon} pe-5x pe-va"></i>`
                    }
                }
                return `<i class="pe-7s-${icon} pe-5x pe-va"></i>`
            }
            return this.player === 'player1'
                ? currPlayer === 'player1'
                    ? iconator('', 'gym')
                    : iconator('', 'gym')
                : currPlayer === 'player2'
                ? iconator('', 'coffee')
                : iconator('', 'coffee')
        }
    },
    template: `
        <div v-bind:style="style" v-html="playerStone()"></div>
    `
})

Vue.component('Cell', {
    props: ['position'],
    data: function () {
        return {}
    },
    methods: {
        renderStone: function (type) {
            const stones = store.getPlayerStones()
            const p1Stones = stones.player1
            const p2Stones = stones.player2
            for (const stone of p1Stones) {
                if (stone === this.position) {
                    if (type === 'compName') return 'stone'
                    else return 'player1'
                }
            }
            for (const stone of p2Stones) {
                if (stone === this.position) {
                    if (type === 'compName') return 'stone'
                    else return 'player2'
                }
            }
        },
        handleClick: function () {
            const { currentPlayer, preMoveStatus, gameOver } = store.state
            if (gameOver) {
                return
            }
            const stones = store.getPlayerStones()
            const p1Stones = stones.player1
            const p2Stones = stones.player2
            const currPlayer = currentPlayer
            if (currPlayer === 'player1') {
                for (const stone of p1Stones) {
                    if (stone === this.position) {
                        if (!preMoveStatus) {
                            store.state.clickedTile = this.position
                            store.state.preMoveStatus = true
                            return
                        } else {
                            store.state.clickedTile = ''
                            store.state.preMoveStatus = false
                            return
                        }
                    }
                }

                store.checkMoves(this.position)
            } else {
                for (const stone of p2Stones) {
                    if (stone === this.position) {
                        if (!preMoveStatus) {
                            store.state.clickedTile = this.position
                            store.state.preMoveStatus = true
                            return
                        } else {
                            store.state.clickedTile = ''
                            store.state.preMoveStatus = false
                            return
                        }
                    }
                }
                store.checkMoves(this.position)
            }
        },
        preMovePhase: function () {
            const { preMoveStatus, emptyTiles } = store.state
            if (preMoveStatus && emptyTiles.indexOf(this.position) > -1) {
                return { backgroundColor: '#9bd4a7cf' }
            }
        }
    },
    template: `
    <div :class="'cell ' + position" v-on:click="handleClick" v-bind:style="preMovePhase()">
        <component v-bind:is="renderStone('compName')" :player="renderStone()"></component>
    </div>  
    `
})
Vue.component('Board', {
    data: function () {
        return {
            positions: ['TL', 'TM', 'TR', 'ML', 'MM', 'MR', 'BL', 'BM', 'BR']
        }
    },
    methods: {},
    template: `
    <div class="board">
        <cell v-for="pos in positions" :position="pos" :key="pos"></cell>
    </div>  
    `
})
const Home = Vue.component('Home', {
    data: function () {
        return {
            gameName: 'Siga'
        }
    },
    methods: {
        checkLock: function (player) {
            return store.state[player].movedAllStones ? false : true
        },
        getCurrentPlayer: function (player) {
            return store.state.currentPlayer === player ? true : false
        },
        getScore: function (player) {
            return player === 'player1'
                ? store.state.player1.score
                : store.state.player2.score
        }
    },
    template: `<main id="home">
        <h1 class="center">{{gameName}}</h1>
        <div id="score-board">
            <div>
                <h2>
                    <span><i v-if="getCurrentPlayer('player1')" class="pe-7s-joy"></i></span> 
                    Player 1
                </h2> 
                <i v-if="checkLock('player1')" class="pe-7s-lock"></i>
            </div>
            <div>
                <h2>
                    <span><i v-if="getCurrentPlayer('player2')" class="pe-7s-joy"></i></span>
                    Player 2
                </h2> 
                <i v-if="checkLock('player2')" class="pe-7s-lock"></i>
            </div>
            <span v-html="getScore('player1')"></span>
            <span v-html="getScore('player2')"></span>
        </div>
        <board></board>
	</main>`
})
const app = new Vue({
    el: '#target',
    data: {
        state: store.state
    },
    computed: {
        ViewComponent() {
            return Home
        }
    },
    render(h) {
        return h(this.ViewComponent)
    }
})
