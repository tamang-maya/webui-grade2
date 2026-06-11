let p1, p2;
let isPlayerTurn = true;

let runAttemptCount = 0; // 逃げる試行回数
// タイプ相性表 (攻撃側: { 防御側: 倍率 })
const typeChart = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, grass: 0.5, electric: 2, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2, electric: 0.5 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

const typeColors = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
};

const typeTranslations = {
    normal: 'ノーマル', fire: 'ほのお', water: 'みず', grass: 'くさ',
    electric: 'でんき', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
    ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
    rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
    steel: 'はがね', fairy: 'フェアリー'
};

async function fetchPokemonData(name, isPlayer) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`);
    if (!response.ok) throw new Error('Pokemon not found');
    const data = await response.json();
    
    // Get first 4 moves
    const moves = data.moves.slice(0, 4).map(m => m.move.name.replace('-', ' '));

    return {
        name: data.name.toUpperCase(),
        hp: data.stats[0].base_stat,
        maxHp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        sprite: isPlayer ? data.sprites.back_default : data.sprites.front_default,
        moves: moves,
        types: data.types.map(t => t.type.name)
    };
}

function updateUI() {
    const updatePokemonUI = (pokemon, prefix) => {
        document.getElementById(`${prefix}-name`).textContent = pokemon.name;
        document.getElementById(`${prefix}-img`).src = pokemon.sprite;
        document.getElementById(`${prefix}-hp-text`).textContent = `${pokemon.hp}/${pokemon.maxHp}`;
        
        const fill = document.getElementById(`${prefix}-hp-fill`);
        const percent = (pokemon.hp / pokemon.maxHp) * 100;
        fill.style.width = `${percent}%`;
        
        // Dynamic colors: Green -> Yellow -> Red
        if (percent < 20) fill.style.backgroundColor = '#e74c3c';
        else if (percent < 50) fill.style.backgroundColor = '#f1c40f';
        else fill.style.backgroundColor = '#2ecc71';

        // タイプの表示
        const typeContainer = document.getElementById(`${prefix}-types`);
        typeContainer.innerHTML = pokemon.types.map(t => 
            `<span class="type-badge" style="background-color: ${typeColors[t] || '#777'}">${typeTranslations[t] || t}</span>`
        ).join('');
    };

    updatePokemonUI(p1, 'p1');
    updatePokemonUI(p2, 'p2');
}

function logAction(message) {
    const log = document.getElementById('log');
    log.innerHTML = `<div>${message}</div>`;
    log.scrollTop = log.scrollHeight;
}

function triggerAttackAnimation(elementId) {
    const el = document.getElementById(elementId);
    el.classList.remove('attack-animation');
    void el.offsetWidth; // Trigger reflow to restart animation
    el.classList.add('attack-animation');
    setTimeout(() => el.classList.remove('attack-animation'), 400); // Match animation duration
}

function triggerShake(elementId) {
    const el = document.getElementById(elementId);
    el.classList.remove('shake');
    void el.offsetWidth; // Trigger reflow to restart animation
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
}

function triggerBlastEffect(defenderImgId) {
    const blastElId = defenderImgId === 'p1-img' ? 'p1-blast-effect' : 'p2-blast-effect';
    const blastEl = document.getElementById(blastElId);
    
    // アニメーションをリセットして再開
    blastEl.classList.remove('blast-active');
    void blastEl.offsetWidth; // リフローを強制してアニメーションを再トリガー
    blastEl.classList.add('blast-active');
}

function createMoveButtons() {
    const container = document.getElementById('move-container');
    container.innerHTML = '';
    p1.moves.forEach(move => {
        const btn = document.createElement('button');
        btn.textContent = move;
        btn.onclick = () => executeTurn(move);
        container.appendChild(btn);
    });
}

function disableButtons(disabled) {
    const buttons = document.querySelectorAll('#move-container button');
    buttons.forEach(btn => btn.disabled = disabled);
}

async function startBattle() {
    const p1Name = document.getElementById('p1-input').value;
    const p2Name = document.getElementById('p2-input').value;
    if (!p1Name || !p2Name) return alert("ポケモンの名前を入力してください。");

    const startBtn = document.getElementById('start-btn');
    startBtn.disabled = true;
    startBtn.textContent = "読み込み中...";

    try {
        [p1, p2] = await Promise.all([
            fetchPokemonData(p1Name, true),
            fetchPokemonData(p2Name, false)
        ]);

        document.getElementById('setup').classList.add('hidden');
        document.getElementById('battle-arena').classList.remove('hidden');
        hidePostBattleControls();
        
        createMoveButtons();
        updateUI();
        logAction(`あ！ やせいの ${p2.name} が とびだしてきた！`);
        setTimeout(() => logAction(`ゆけっ！ ${p1.name} !`), 1500);
        isPlayerTurn = true;
        disableButtons(false);
    } catch (err) {
        alert("エラー: 正しいポケモンの名前を入力してください（英語名）。");
    } finally {
        startBtn.disabled = false;
        startBtn.textContent = "バトル開始！";
    }
}

function calculateDamage(attacker, defender) {
    const baseDamage = Math.floor((attacker.attack / (defender.defense * 0.5)) * 5);
    const randomFactor = Math.random() * (1.1 - 0.9) + 0.9;

    let multiplier = 1;
    const atkType = attacker.types[0]; // 攻撃側の第1タイプを攻撃属性とする

    defender.types.forEach(defType => {
        if (typeChart[atkType] && typeChart[atkType][defType] !== undefined) {
            multiplier *= typeChart[atkType][defType];
        }
    });

    return {
        damage: Math.max(2, Math.floor(baseDamage * randomFactor * multiplier)),
        multiplier: multiplier
    };
}

function executeTurn(moveName) {
    if (!isPlayerTurn) return;

    // Player Turn
    const result = calculateDamage(p1, p2);
    p2.hp = Math.max(0, p2.hp - result.damage);
    
    logAction(`${p1.name} の ${moveName}！`); // 技名表示
    triggerAttackAnimation('p1-img'); // 攻撃アニメーション開始
    
    setTimeout(() => { // 攻撃アニメーションと技名表示の後のディレイ
        let effectiveMsg = "";
        if (result.multiplier > 1) effectiveMsg = "こうかは ばつぐんだ！";
        else if (result.multiplier < 1 && result.multiplier > 0) effectiveMsg = "こうかは いまひとつの ようだ...";
        else if (result.multiplier === 0) effectiveMsg = "こうかが ない みたいだ...";

        if (effectiveMsg) logAction(effectiveMsg);

        setTimeout(() => { // 相性メッセージの後のディレイ
            logAction(`あいての ${p2.name} に ${result.damage} ダメージ！`);
            triggerBlastEffect('p2-img'); // 爆発エフェクトを相手ポケモンに表示
            triggerShake('p2-img');
            updateUI();

            if (p2.hp <= 0) {
                setTimeout(() => {
                    logAction(`あいての ${p2.name} は たおれた！`);
                    showPostBattleControls();
                    disableButtons(true);
                }, 800);
                return;
            }

            isPlayerTurn = false;
            disableButtons(true);
            enemyTurn();
        }, effectiveMsg ? 800 : 400); // 相性メッセージがあれば800ms、なければ400ms
    }, 800);
}

function enemyTurn() {
    setTimeout(() => {
        const enemyMove = p2.moves[Math.floor(Math.random() * p2.moves.length)];
        const result = calculateDamage(p2, p1);
        p1.hp = Math.max(0, p1.hp - result.damage);
        logAction(`あいての ${p2.name} の ${enemyMove}！`); // 技名表示
        triggerAttackAnimation('p2-img'); // 攻撃アニメーション開始
        
        setTimeout(() => { // 攻撃アニメーションと技名表示の後のディレイ
            let effectiveMsg = "";
            if (result.multiplier > 1) effectiveMsg = "こうかは ばつぐんだ！";
            else if (result.multiplier < 1 && result.multiplier > 0) effectiveMsg = "こうかは いまひとつの ようだ...";
            else if (result.multiplier === 0) effectiveMsg = "こうかが ない みたいだ...";

            if (effectiveMsg) logAction(effectiveMsg);

            setTimeout(() => { // 相性メッセージの後のディレイ
                logAction(`${p1.name} は ${result.damage} ダメージ うけた！`);
                triggerBlastEffect('p1-img'); // 爆発エフェクトを自分のポケモンに表示
            triggerShake('p1-img');
            updateUI();

            if (p1.hp <= 0) {
                setTimeout(() => {
                    logAction(`${p1.name} は たおれた...`);
                    showPostBattleControls();
                }, 1000);
            } else {
                isPlayerTurn = true;
                disableButtons(false);
            }
            }, effectiveMsg ? 800 : 400); // 相性メッセージがあれば800ms、なければ400ms
        }, 800);
    }, 1000);
}

function showPostBattleControls() {
    document.getElementById('post-battle-controls').classList.remove('hidden');
}

function hidePostBattleControls() {
    document.getElementById('post-battle-controls').classList.add('hidden');
}

function resetGame() {
    // 入力を残す場合はここを弄る
    isPlayerTurn = true;
    document.getElementById('battle-arena').classList.add('hidden');
    document.getElementById('setup').classList.remove('hidden');
    document.getElementById('log').textContent = 'どうする？';
    hidePostBattleControls();
}

function rematch() {
    // 現在のポケモンのHPを全回復して再戦
    p1.hp = p1.maxHp;
    p2.hp = p2.maxHp;
    isPlayerTurn = true;
    updateUI();
    hidePostBattleControls();
    disableButtons(false);
    logAction(`せんとうさいかい！`);
    setTimeout(() => logAction(`ゆけっ！ ${p1.name} !`), 1000);
}

document.getElementById('start-btn').addEventListener('click', startBattle);
document.getElementById('rematch-btn').addEventListener('click', rematch);
document.getElementById('exit-btn').addEventListener('click', resetGame);