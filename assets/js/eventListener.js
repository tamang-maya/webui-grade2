// document.getElementById("btn").addEventListener("click", function() {
//     document.getElementById("result").textContent = "クリックされました！";

// });



function changetext() {
    document.getElementById("result").textContent = "ボタンがクリックされました！";
}
    document.getElementById("btn").addEventListener("click", changetext()); 
