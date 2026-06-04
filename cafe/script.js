// form
function reserve() {
 // 入力した内容を取得する
    const name = document.getElementById('guestName').value;
    const count = document.getElementById('guestCount').value;

    //  結果を表示する場所を取得する
    const result = document.getElementById('reserveResult');

    // 名前か人数が空だったら、注意メッセージを出して終了する
    // if (name === '') {
    //     result.textContent = 'お名前を入力してください';
    //     return;
    // }else if (count === '') {
    //     result.textContent = 'お人数を入力してください';
    //     return;
    // }else{
        
    // // 完成したメッセージを画面に表示する
    //     result.textContent = `✓ ご予約ありがとうございます、${name}様。${count}名様で承りました。`;

    // }
    if (name === '' || count === '') {

        result.textContent = '入力してください';

        return;

    } else {

        result.textContent = `✓ ご予約ありがとうございます、${name}様。${count}名様で承りました。`;
    }
    }
   //recommend
    function pickRecommend() {
        const items =[
            '本日のコーヒ',
            'カフェラテ',
            'チーズケーキ',
            'カプチーノ',
            'エスプレッソ',
            'アイスコーヒー'
        ];
        const i = Math.floor(Math.random() * items.length);
        document.getElementById('recommendResult').textContent = `今日のおすすめは、${items[i]}です！`;
    }

        //テーマ変更（ボタンを押すたびに色を切り替える）
        const themes = [
            { name: 'coffee', main: '#78350F', accent: '#F59E0B', bg: '#FFFBEB' },
            { name: 'forest', main: '#15803D', accent: '#F97316', bg: '#F0FDF4' },
            { name: 'sunset', main: '#DB2777', accent: '#7C3AED', bg: '#FDF2F8' },
            { name: 'ocean',  main: '#0369A1', accent: '#FBBF24', bg: '#F0F9FF' },
         ];
         let themeIndex = 0;
         
            function toggleTheme() {
                console.log('テーマ変更ボタンが押されました');

                //themeindex= 1% 4;
                themeIndex = (themeIndex + 1) % themes.length;

                // 現在のテーマを取得する
                const theme = themes[themeIndex];

                // CSS変数を更新して、テーマの色を切り替える
                document.documentElement.style.setProperty('--main-color', theme.main);
                document.documentElement.style.setProperty('--accent-color', theme.accent);
                document.documentElement.style.setProperty('--bg-color', theme.bg);
            }
    function countVisit() {
        
        // localStorageから訪問回数を取得する。初めての場合は0にする

        let count = localStorage.getItem('visitCount');// localStorageは文字列で保存されるため、数値に変換する必要がある/できるだけ大事なことに使わないようにすること//
        if ( count === null ) { 
        count = 0;
        } else {
        count = Number(count);
        }
        count = count + 1;
        localStorage.setItem('visitCount', count);

        document.getElementById('visitCount').textContent = count;
    }
    countVisit();
             
