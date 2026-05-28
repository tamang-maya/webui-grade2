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
        const recommendResult = document.getElementById('recommendResult');
        const menuItems = ['カフェラテ', 'カプチーノ', 'エスプレッソ', 'アメリカーノ', 'モカ'];
        const randomIndex = Math.floor(Math.random() * menuItems.length);
        const recommendItem = menuItems[randomIndex];
        recommendResult.textContent = `おすすめは「${recommendItem}」です！`;
     }
